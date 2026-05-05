import { useState, useCallback } from 'react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

/**
 * useProfile: Custom hook for profile management operations
 * Handles updating profile, changing password, removing avatar
 * Automatically updates auth context after successful operations
 *
 * @returns {Object} Profile management interface
 */
export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   * @param {File} avatar - Optional new avatar file
   */
  const updateProfile = useCallback(async (updates, avatar = null) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedUser = await userService.updateProfile(updates, avatar);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully');

      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  /**
   * Change user password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await userService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove user avatar
   */
  const removeAvatar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await userService.removeAvatar();

      // Update user in context
      const updatedUser = { ...user, avatar_url: null };
      updateUser(updatedUser);
      setSuccess('Avatar removed successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  /**
   * Clear error and success messages
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    loading,
    error,
    success,
    updateProfile,
    changePassword,
    removeAvatar,
    clearMessages,
  };
};

export default useProfile;
