const ActivityLog = require('../models/ActivityLog');

// Log user activity
exports.logActivity = async (userId, action, contactId, description) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      contact: contactId,
      description
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

