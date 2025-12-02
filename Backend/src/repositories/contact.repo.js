const prisma = require('../config/prisma');

/**
 * Contact Repository
 * Handles all database operations related to contact inquiries
 */
class ContactRepository {
  /**
   * Create a new contact inquiry
   */
  async create(contactData) {
    return await prisma.contact.create({
      data: contactData,
    });
  }

  /**
   * Find contact by ID
   */
  async findById(id) {
    return await prisma.contact.findUnique({
      where: { id },
    });
  }

  /**
   * Update contact status
   */
  async updateStatus(id, status) {
    return await prisma.contact.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get all contact inquiries
   */
  async findAll(filters = {}) {
    return await prisma.contact.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete contact inquiry
   */
  async delete(id) {
    return await prisma.contact.delete({
      where: { id },
    });
  }
}

module.exports = new ContactRepository();

