const crypto = require('crypto');

/**
 * Hash a password using SHA256
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} True if password matches hash
 */
const verifyPassword = (password, hash) => {
  const hashedPassword = hashPassword(password);
  return hashedPassword === hash;
};

module.exports = {
  hashPassword,
  verifyPassword,
};

