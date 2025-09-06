// services/userSyncService.js
const { syncFirebaseUser } = require('../controllers/authController');
const User = require('../models/User');

class UserSyncService {
  /**
   * Sync a Firebase user with MongoDB
   * @param {Object} firebaseUser - Decoded Firebase user token
   * @returns {Object} MongoDB user document
   */
  static async syncUser(firebaseUser) {
    try {
      return await syncFirebaseUser(firebaseUser);
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  }

  /**
   * Get user by email with sync
   * @param {string} email - User email
   * @param {Object} firebaseUser - Decoded Firebase user token
   * @returns {Object} MongoDB user document
   */
  static async getUserByEmailWithSync(email, firebaseUser) {
    try {
      // First sync the user data
      const syncedUser = await this.syncUser(firebaseUser);
      
      // Then retrieve the user
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error getting user with sync:', error);
      throw error;
    }
  }

  /**
   * Check if user is active
   * @param {Object} user - MongoDB user document
   * @returns {boolean} Whether user is active
   */
  static isUserActive(user) {
    return user && user.isActive === true;
  }

  /**
   * Validate user session
   * @param {Object} user - MongoDB user document
   * @returns {Object} Validation result
   */
  static validateUserSession(user) {
    if (!user) {
      return { isValid: false, reason: 'User not found' };
    }
    
    if (!this.isUserActive(user)) {
      return { isValid: false, reason: 'User account is inactive' };
    }
    
    return { isValid: true };
  }
}

module.exports = UserSyncService;