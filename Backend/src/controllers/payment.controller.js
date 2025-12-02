const paymentService = require('../services/payment.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Payment Controller
 * Handles HTTP requests related to payments
 */
class PaymentController {
  /**
   * Create a new payment order
   */
  async createOrder(req, res) {
    try {
      const { amount } = req.body;
      const order = await paymentService.createOrder(amount);
      return sendSuccess(res, 'Order created successfully', order, 201);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const result = await paymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      
      if (result.success) {
        return sendSuccess(res, 'Payment verified successfully', result);
      } else {
        return sendError(res, result.message || 'Payment verification failed', 400);
      }
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(req, res) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentDetails(id);
      return sendSuccess(res, 'Payment details retrieved successfully', payment);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get all payments
   */
  async getAllPayments(req, res) {
    try {
      const payments = await paymentService.getAllPayments(req.query);
      return sendSuccess(res, 'Payments retrieved successfully', payments);
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new PaymentController();

