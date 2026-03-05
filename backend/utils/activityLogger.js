import ActivityLog from '../models/ActivityLog.js';

// Log user activity
export const logActivity = async (userId, action, contactId, description) => {
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

