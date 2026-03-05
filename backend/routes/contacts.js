const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  getContacts, 
  getContact, 
  createContact, 
  updateContact, 
  deleteContact,
  exportContacts 
} = require('../controllers/contactController');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private
router.get('/', protect, getContacts);

// @route   GET /api/contacts/export
// @desc    Export contacts as CSV
// @access  Private
router.get('/export', protect, exportContacts);

// @route   GET /api/contacts/:id
// @desc    Get single contact
// @access  Private
router.get('/:id', protect, getContact);

// @route   POST /api/contacts
// @desc    Create new contact
// @access  Private
router.post('/', protect, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('status').optional().isIn(['lead', 'prospect', 'customer']).withMessage('Status must be lead, prospect or customer'),
  body('notes').optional().trim()
], validate, createContact);

// @route   PUT /api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', protect, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('status').optional().isIn(['lead', 'prospect', 'customer']).withMessage('Status must be lead, prospect or customer'),
  body('notes').optional().trim()
], validate, updateContact);

// @route   DELETE /api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', protect, deleteContact);

module.exports = router;

