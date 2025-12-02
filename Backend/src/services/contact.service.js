const contactRepo = require('../repositories/contact.repo');

/**
 * Contact Service
 * Handles contact inquiry-related business logic
 */
class ContactService {
  /**
   * Create a new contact inquiry
   */
  async createContact(contactData) {
    try {
      return await contactRepo.create({
        ...contactData,
        status: 'pending',
      });
    } catch (error) {
      throw new Error(`Failed to create contact inquiry: ${error.message}`);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(id) {
    try {
      const contact = await contactRepo.findById(id);
      if (!contact) {
        throw new Error('Contact inquiry not found');
      }
      return contact;
    } catch (error) {
      throw new Error(`Failed to get contact inquiry: ${error.message}`);
    }
  }

  /**
   * Update contact status
   */
  async updateContactStatus(id, status) {
    try {
      const contact = await contactRepo.findById(id);
      if (!contact) {
        throw new Error('Contact inquiry not found');
      }
      return await contactRepo.updateStatus(id, status);
    } catch (error) {
      throw new Error(`Failed to update contact status: ${error.message}`);
    }
  }

  /**
   * Get all contact inquiries
   */
  async getAllContacts(filters = {}) {
    try {
      return await contactRepo.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get contact inquiries: ${error.message}`);
    }
  }

  /**
   * Delete contact inquiry
   */
  async deleteContact(id) {
    try {
      const contact = await contactRepo.findById(id);
      if (!contact) {
        throw new Error('Contact inquiry not found');
      }
      return await contactRepo.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete contact inquiry: ${error.message}`);
    }
  }
}

module.exports = new ContactService();

