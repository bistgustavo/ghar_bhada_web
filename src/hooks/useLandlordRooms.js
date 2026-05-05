import { useState, useCallback } from 'react';
import roomService from '../services/roomService';

/**
 * useLandlordRooms: Custom hook for landlord room management
 * Backend returns: { total, skip, limit, rooms: [...] }
 */
export const useLandlordRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchMyListings = useCallback(async (pagination = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await roomService.getMyListings(pagination);
      // Backend returns { total, skip, limit, rooms: [...] }
      setRooms(response.rooms || []);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch listings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (roomData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const newRoom = await roomService.createRoom(roomData);
      setRooms((prev) => [newRoom, ...prev]);
      setSuccess('Room created successfully! Awaiting admin approval.');
      return newRoom;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create room';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (roomId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedRoom = await roomService.updateRoom(roomId, updateData);
      setRooms((prev) =>
        prev.map((room) => (room.id === roomId ? updatedRoom : room))
      );
      setSuccess('Room updated successfully');
      return updatedRoom;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update room';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await roomService.deleteRoom(roomId);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
      setSuccess('Room deleted successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete room';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(async (roomId) => {
    try {
      setError(null);
      setSuccess(null);

      await roomService.toggleAvailability(roomId);
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id === roomId) {
            return { ...room, is_available: !room.is_available };
          }
          return room;
        })
      );
      setSuccess('Availability toggled');
    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle availability';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    rooms,
    loading,
    error,
    success,
    fetchMyListings,
    createRoom,
    updateRoom,
    deleteRoom,
    toggleAvailability,
    clearMessages,
  };
};

export default useLandlordRooms;
