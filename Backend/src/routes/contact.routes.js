const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

/**
 * Contact Routes
 */
router.post('/', contactController.createContact);
router.get('/:id', authenticate, authorizeAdmin, contactController.getContactById);
router.put('/:id/status', authenticate, authorizeAdmin, contactController.updateContactStatus);
router.delete('/:id', authenticate, authorizeAdmin, contactController.deleteContact);
router.get('/', authenticate, authorizeAdmin, contactController.getAllContacts);

module.exports = router;

