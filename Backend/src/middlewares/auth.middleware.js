const { sendError } = require('../utils/response');
const { verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 'Authentication token required', 401);
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return sendError(res, 'Authentication token required', 401);
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    // Attach user info to request object
    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return sendError(res, error.message || 'Invalid or expired token', 401);
  }
};

/**
 * Admin authorization middleware
 * Must be used after authenticate middleware
 */
const authorizeAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return sendError(res, 'Admin access required', 403);
    }

    next();
  } catch (error) {
    return sendError(res, 'Authorization failed', 403);
  }
};

module.exports = {
  authenticate,
  authorizeAdmin,
};

