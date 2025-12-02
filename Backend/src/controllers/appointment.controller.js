const appointmentService = require('../services/appointment.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Appointment Controller
 * Handles HTTP requests related to appointments
 */
class AppointmentController {
  /**
   * Create a new appointment
   */
  async createAppointment(req, res) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return sendSuccess(res, 'Appointment created successfully', appointment, 201);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);
      return sendSuccess(res, 'Appointment retrieved successfully', appointment);
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Get appointments by user ID
   */
  async getAppointmentsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const appointments = await appointmentService.getAppointmentsByUserId(userId);
      return sendSuccess(res, 'Appointments retrieved successfully', appointments);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.updateAppointment(id, req.body);
      return sendSuccess(res, 'Appointment updated successfully', appointment);
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      await appointmentService.deleteAppointment(id);
      return sendSuccess(res, 'Appointment deleted successfully');
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(req, res) {
    try {
      const appointments = await appointmentService.getAllAppointments(req.query);
      return sendSuccess(res, 'Appointments retrieved successfully', appointments);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new AppointmentController();

