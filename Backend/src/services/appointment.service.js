const appointmentRepo = require('../repositories/appointment.repo');

/**
 * Helper function to convert time string to 24-hour format
 */
function convertTimeTo24Hour(timeStr) {
  if (!timeStr) return '00:00:00';
  
  // Check if it's in 12-hour format (e.g., "10:00 AM" or "2:30 PM")
  const match12Hour = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match12Hour) {
    let hours = parseInt(match12Hour[1]);
    const minutes = match12Hour[2];
    const period = match12Hour[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  }
  
  // Check if it's already in 24-hour format (HH:MM or HH:MM:SS)
  const match24Hour = timeStr.match(/^(\d{1,2}):(\d{2})(:\d{2})?$/);
  if (match24Hour) {
    const hours = match24Hour[1].padStart(2, '0');
    const minutes = match24Hour[2];
    return `${hours}:${minutes}:00`;
  }
  
  return '00:00:00';
}

/**
 * Helper function to convert date string to DateTime
 */
function convertDateString(dateStr, timeStr) {
  if (!dateStr) return null;
  
  // If it's already a Date object, return it
  if (dateStr instanceof Date) {
    return dateStr;
  }
  
  // If it's a date string in YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const timePart = convertTimeTo24Hour(timeStr);
    const dateTime = new Date(`${dateStr}T${timePart}`);
    
    if (isNaN(dateTime.getTime())) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    
    return dateTime;
  }
  
  // Try to parse as ISO string or other format
  const dateTime = new Date(dateStr);
  if (isNaN(dateTime.getTime())) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
  }
  
  return dateTime;
}

/**
 * Appointment Service
 * Handles appointment-related business logic
 */
class AppointmentService {
  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData) {
    try {
      // Convert date string to DateTime if needed
      const processedData = { ...appointmentData };
      if (processedData.date) {
        processedData.date = convertDateString(processedData.date, processedData.time);
      }
      
      return await appointmentRepo.create(processedData);
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id) {
    try {
      const appointment = await appointmentRepo.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return appointment;
    } catch (error) {
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  }

  /**
   * Get appointments by user ID
   */
  async getAppointmentsByUserId(userId) {
    try {
      return await appointmentRepo.findByUserId(userId);
    } catch (error) {
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(id, appointmentData) {
    try {
      const appointment = await appointmentRepo.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      // Convert date string to DateTime if needed
      const processedData = { ...appointmentData };
      if (processedData.date) {
        const timeStr = processedData.time || appointment.time;
        processedData.date = convertDateString(processedData.date, timeStr);
      }
      
      return await appointmentRepo.update(id, processedData);
    } catch (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(id) {
    try {
      const appointment = await appointmentRepo.findById(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return await appointmentRepo.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(filters = {}) {
    try {
      return await appointmentRepo.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
  }
}

module.exports = new AppointmentService();

