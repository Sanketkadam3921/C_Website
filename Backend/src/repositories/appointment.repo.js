const prisma = require('../config/prisma');

/**
 * Appointment Repository
 * Handles all database operations related to appointments
 */
class AppointmentRepository {
  /**
   * Create a new appointment
   */
  async create(appointmentData) {
    return await prisma.appointment.create({
      data: appointmentData,
    });
  }

  /**
   * Find appointment by ID
   */
  async findById(id) {
    return await prisma.appointment.findUnique({
      where: { id },
    });
  }

  /**
   * Find appointments by user ID
   */
  async findByUserId(userId) {
    return await prisma.appointment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update appointment
   */
  async update(id, appointmentData) {
    return await prisma.appointment.update({
      where: { id },
      data: appointmentData,
    });
  }

  /**
   * Delete appointment
   */
  async delete(id) {
    return await prisma.appointment.delete({
      where: { id },
    });
  }

  /**
   * Get all appointments
   */
  async findAll(filters = {}) {
    return await prisma.appointment.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new AppointmentRepository();

