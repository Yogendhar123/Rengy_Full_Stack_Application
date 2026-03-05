const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getActivities } = require('../controllers/activityController');

// @route   GET /api/activities
// @desc    Get all activities
// @access  Private
router.get('/', protect, getActivities);

module.exports = router;

