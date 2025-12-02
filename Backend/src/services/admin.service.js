const adminRepo = require('../repositories/admin.repo');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');

/**
 * Admin Service
 * Handles admin-related business logic
 */
class AdminService {
  /**
   * Create a new admin user
   */
  async createAdmin(adminData) {
    try {
      const existingAdmin = await adminRepo.findByEmail(adminData.email);
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      const hashedPassword = hashPassword(adminData.password);
      const admin = await adminRepo.create({
        ...adminData,
        password: hashedPassword,
      });

      // Generate JWT token for the new admin
      const token = generateToken(admin);

      // Return admin data without password and include token
      return {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          createdAt: admin.createdAt,
        },
        token,
      };
    } catch (error) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  /**
   * Login admin
   */
  async loginAdmin(email, password) {
    try {
      const admin = await adminRepo.findByEmail(email);
      if (!admin) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = verifyPassword(password, admin.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken(admin);

      return {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        token,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(id) {
    try {
      const admin = await adminRepo.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new Error(`Failed to get admin: ${error.message}`);
    }
  }

  /**
   * Get all admins
   */
  async getAllAdmins() {
    try {
      return await adminRepo.findAll();
    } catch (error) {
      throw new Error(`Failed to get admins: ${error.message}`);
    }
  }
}

module.exports = new AdminService();

