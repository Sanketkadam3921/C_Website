const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * Appointment Routes
 */
// Public route - anyone can book an appointment
router.post('/', appointmentController.createAppointment);
// Protected routes - require authentication
router.get('/user/:userId', authenticate, appointmentController.getAppointmentsByUserId);
router.get('/:id', authenticate, appointmentController.getAppointmentById);
router.put('/:id', authenticate, appointmentController.updateAppointment);
router.delete('/:id', authenticate, appointmentController.deleteAppointment);
router.get('/', authenticate, appointmentController.getAllAppointments);

module.exports = router;

