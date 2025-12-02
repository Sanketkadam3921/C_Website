const prisma = require('../config/prisma');

/**
 * Payment Repository
 * Handles all database operations related to payments
 */
class PaymentRepository {
  /**
   * Create a new payment record
   */
  async create(paymentData) {
    return await prisma.payment.create({
      data: paymentData,
    });
  }

  /**
   * Find payment by ID
   */
  async findById(id) {
    return await prisma.payment.findUnique({
      where: { id },
    });
  }

  /**
   * Find payment by order ID
   */
  async findByOrderId(orderId) {
    return await prisma.payment.findFirst({
      where: { razorpayOrderId: orderId },
    });
  }

  /**
   * Update payment status
   */
  async updateStatus(id, status) {
    return await prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get all payments
   */
  async findAll(filters = {}) {
    return await prisma.payment.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new PaymentRepository();

