const contactService = require('../services/contact.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Contact Controller
 * Handles HTTP requests related to contact inquiries
 */
class ContactController {
  /**
   * Create a new contact inquiry
   */
  async createContact(req, res) {
    try {
      const contact = await contactService.createContact(req.body);
      return sendSuccess(res, 'Contact inquiry submitted successfully', contact, 201);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contact = await contactService.getContactById(id);
      return sendSuccess(res, 'Contact inquiry retrieved successfully', contact);
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Update contact status
   */
  async updateContactStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contact = await contactService.updateContactStatus(id, status);
      return sendSuccess(res, 'Contact status updated successfully', contact);
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Get all contact inquiries
   */
  async getAllContacts(req, res) {
    try {
      const contacts = await contactService.getAllContacts(req.query);
      return sendSuccess(res, 'Contact inquiries retrieved successfully', contacts);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Delete contact inquiry
   */
  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      await contactService.deleteContact(id);
      return sendSuccess(res, 'Contact inquiry deleted successfully');
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }
}

module.exports = new ContactController();

