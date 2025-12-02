/**
 * Validation middleware
 * Placeholder for request validation using libraries like Joi or express-validator
 */

/**
 * Validate request body
 * @param {Function} validator - Validation function
 */
const validate = (validator) => {
  return (req, res, next) => {
    try {
      const { error, value } = validator(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      req.body = value;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
};

/**
 * Validate payment verification request
 */
const validatePaymentVerification = (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing required payment verification fields',
    });
  }

  next();
};

/**
 * Validate order creation request
 */
const validateOrderCreation = (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required',
    });
  }

  next();
};

module.exports = {
  validate,
  validatePaymentVerification,
  validateOrderCreation,
};

