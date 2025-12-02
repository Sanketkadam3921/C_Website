const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Generate JWT token for admin
 * @param {Object} admin - Admin object with id, email, name, role
 * @returns {string} JWT token
 */
const generateToken = (admin) => {
  const payload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role || 'admin',
  };

  const options = {
    expiresIn: '7d', // Token expires in 7 days
    issuer: 'razorpay-backend',
    subject: admin.id.toString(),
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

