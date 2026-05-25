import axiosClient from './axiosClient';

/**
 * Room Photo Service: Handle room photo uploads and management
 * Aligned to FastAPI backend routes in app/routes/room_photo_routes.py
 */
const roomPhotoService = {
  /**
   * Upload photos for a room
   * @param {string} roomId
   * @param {FileList|File[]} files - Array of files to upload
   */
  uploadPhotos: async (roomId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosClient.post(`/rooms/${roomId}/photos/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Get all photos for a room
   * @param {string} roomId
   */
  getPhotos: async (roomId) => {
    const response = await axiosClient.get(`/rooms/${roomId}/photos/`);
    return response.data;
  },

  /**
   * Set a photo as the cover image
   * @param {string} roomId
   * @param {string} photoId
   */
  setCoverPhoto: async (roomId, photoId) => {
    const response = await axiosClient.patch(`/rooms/${roomId}/photos/cover`, { photo_id: photoId });
    return response.data;
  },

  /**
   * Reorder photos
   * @param {string} roomId
   * @param {string[]} photoIds - Ordered list of photo IDs
   */
  reorderPhotos: async (roomId, photoIds) => {
    const response = await axiosClient.patch(`/rooms/${roomId}/photos/reorder`, { photo_ids: photoIds });
    return response.data;
  },

  /**
   * Delete a single photo
   * @param {string} roomId
   * @param {string} photoId
   */
  deletePhoto: async (roomId, photoId) => {
    const response = await axiosClient.delete(`/rooms/${roomId}/photos/${photoId}`);
    return response.data;
  },

  /**
   * Delete all photos for a room
   * @param {string} roomId
   */
  deleteAllPhotos: async (roomId) => {
    const response = await axiosClient.delete(`/rooms/${roomId}/photos/`);
    return response.data;
  },
};

export default roomPhotoService;
