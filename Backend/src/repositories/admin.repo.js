const prisma = require('../config/prisma');

/**
 * Admin Repository
 * Handles all database operations related to admin users
 */
class AdminRepository {
  /**
   * Create a new admin user
   */
  async create(adminData) {
    return await prisma.admin.create({
      data: adminData,
    });
  }

  /**
   * Find admin by ID
   */
  async findById(id) {
    return await prisma.admin.findUnique({
      where: { id },
    });
  }

  /**
   * Find admin by email
   */
  async findByEmail(email) {
    return await prisma.admin.findUnique({
      where: { email },
    });
  }

  /**
   * Update admin
   */
  async update(id, adminData) {
    return await prisma.admin.update({
      where: { id },
      data: adminData,
    });
  }

  /**
   * Get all admins
   */
  async findAll() {
    return await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new AdminRepository();

