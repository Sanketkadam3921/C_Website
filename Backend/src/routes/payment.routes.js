const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validateOrderCreation, validatePaymentVerification } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * Payment Routes
 */
router.post('/create-order', validateOrderCreation, paymentController.createOrder);
router.post('/verify-payment', validatePaymentVerification, paymentController.verifyPayment);
router.get('/:id', authenticate, paymentController.getPaymentDetails);
router.get('/', authenticate, paymentController.getAllPayments);

module.exports = router;

