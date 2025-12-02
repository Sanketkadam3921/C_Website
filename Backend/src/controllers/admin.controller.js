const adminService = require('../services/admin.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Admin Controller
 * Handles HTTP requests related to admin operations
 */
class AdminController {
  /**
   * Create a new admin
   */
  async createAdmin(req, res) {
    try {
      const admin = await adminService.createAdmin(req.body);
      return sendSuccess(res, 'Admin created successfully', admin, 201);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  /**
   * Admin login
   */
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await adminService.loginAdmin(email, password);
      return sendSuccess(res, 'Login successful', result);
    } catch (error) {
      return sendError(res, error.message, 401);
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminService.getAdminById(id);
      return sendSuccess(res, 'Admin retrieved successfully', admin);
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Get all admins
   */
  async getAllAdmins(req, res) {
    try {
      const admins = await adminService.getAllAdmins();
      return sendSuccess(res, 'Admins retrieved successfully', admins);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new AdminController();

