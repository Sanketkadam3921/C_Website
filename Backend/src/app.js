const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const paymentRoutes = require('./routes/payment.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');

// Import middlewares
const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Legacy routes for backward compatibility
const paymentController = require('./controllers/payment.controller');
const { validateOrderCreation, validatePaymentVerification } = require('./middlewares/validate.middleware');
app.post('/create-order', validateOrderCreation, paymentController.createOrder.bind(paymentController));
app.post('/verify-payment', validatePaymentVerification, paymentController.verifyPayment.bind(paymentController));

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;

