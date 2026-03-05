import express from 'express';
import { protect } from '../middleware/auth.js';
import { getActivities } from '../controllers/activityController.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities
// @access  Private
router.get('/', protect, getActivities);

export default router;

