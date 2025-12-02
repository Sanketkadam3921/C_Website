/**
 * Generate a unique receipt ID
 * @returns {string} Receipt ID
 */
const generateReceipt = () => {
  return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate receipt details for payment
 * @param {Object} paymentData - Payment information
 * @returns {Object} Receipt object
 */
const generateReceiptDetails = (paymentData) => {
  return {
    receiptId: generateReceipt(),
    timestamp: new Date().toISOString(),
    ...paymentData,
  };
};

module.exports = {
  generateReceipt,
  generateReceiptDetails,
};

