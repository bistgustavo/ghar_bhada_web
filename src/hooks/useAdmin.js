import { useState, useCallback } from 'react';
import userService from '../services/userService';
import roomService from '../services/roomService';

/**
 * useAdminUsers: Custom hook for admin user management
 * Backend returns: { total, skip, limit, users: [...] }
 */
export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.listUsers(filters);
      // Backend returns { total, skip, limit, users: [...] }
      setUsers(response.users || []);
      setTotal(response.total || 0);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch users';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const activateUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await userService.activateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: true } : u))
      );
      setSuccess('User activated successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to activate user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await userService.deactivateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: false } : u))
      );
      setSuccess('User deactivated successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to deactivate user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await userService.verifyUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_verified: true } : u))
      );
      setSuccess('User verified successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    users,
    total,
    loading,
    error,
    success,
    fetchUsers,
    activateUser,
    deactivateUser,
    verifyUser,
    clearMessages,
  };
};

/**
 * useAdminRooms: Custom hook for admin room moderation
 * Backend returns: { total, skip, limit, rooms: [...] }
 */
export const useAdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchRooms = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await roomService.getAllRooms(filters);
      // Backend returns { total, skip, limit, rooms: [...] }
      setRooms(response.rooms || []);
      setTotal(response.total || 0);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch rooms';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewRoom = useCallback(async (roomId, newStatus, adminNote = '') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedRoom = await roomService.reviewRoom(roomId, newStatus, adminNote);
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? { ...room, status: newStatus, admin_note: adminNote }
            : room
        )
      );
      setSuccess(`Room ${newStatus.toLowerCase()} successfully`);
      return updatedRoom;
    } catch (err) {
      const errorMessage = err.message || 'Failed to review room';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    rooms,
    total,
    loading,
    error,
    success,
    fetchRooms,
    reviewRoom,
    clearMessages,
  };
};
