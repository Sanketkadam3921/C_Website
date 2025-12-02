const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const paymentRepo = require("../repositories/payment.repo");
const { generateReceipt } = require("../utils/generateReceipt");

/**
 * Payment Service
 * Handles payment-related business logic
 */
class PaymentService {
  /**
   * Create a Razorpay order
   */
  async createOrder(amount) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: generateReceipt(),
      };

      const order = await razorpay.orders.create(options);

      // Save order to database
      await paymentRepo.create({
        razorpayOrderId: order.id,
        amount: amount,
        currency: "INR",
        status: "pending",
        receipt: options.receipt,
      });

      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  ) {
    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", razorpay.key_secret)
        .update(sign.toString())
        .digest("hex");

      if (expectedSign === razorpay_signature) {
        // Update payment status in database
        const payment = await paymentRepo.findByOrderId(razorpay_order_id);
        if (payment) {
          await paymentRepo.updateStatus(payment.id, "success");
        }

        return { success: true, paymentId: razorpay_payment_id };
      } else {
        return { success: false, message: "Invalid signature" };
      }
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      return await paymentRepo.findById(paymentId);
    } catch (error) {
      throw new Error(`Failed to get payment details: ${error.message}`);
    }
  }

  /**
   * Get all payments
   */
  async getAllPayments(filters = {}) {
    try {
      return await paymentRepo.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();
