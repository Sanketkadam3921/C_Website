const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

/**
 * Admin Routes
 */
// Register requires authentication and admin authorization
// Note: For the first admin, you may need to create it via database seed or a bootstrap script
router.post('/register', authenticate, authorizeAdmin, adminController.createAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/:id', authenticate, authorizeAdmin, adminController.getAdminById);
router.get('/', authenticate, authorizeAdmin, adminController.getAllAdmins);

module.exports = router;

