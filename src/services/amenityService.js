import axiosClient from './axiosClient';

/**
 * Amenity Service: Handle room amenities
 * Aligned to FastAPI backend routes in app/routes/amenity_routes.py
 */
const amenityService = {
  /**
   * Add one or more amenities to a room
   * @param {string} roomId
   * @param {string[]} names - List of amenity names to add
   */
  addAmenities: async (roomId, names) => {
    const response = await axiosClient.post(`/rooms/${roomId}/amenities/`, { names });
    return response.data;
  },

  /**
   * Get all amenities for a specific room
   * @param {string} roomId
   */
  getAmenities: async (roomId) => {
    const response = await axiosClient.get(`/rooms/${roomId}/amenities/`);
    return response.data;
  },

  /**
   * Update an amenity name
   * @param {string} roomId
   * @param {string} amenityId
   * @param {string} name - New name for the amenity
   */
  updateAmenity: async (roomId, amenityId, name) => {
    const response = await axiosClient.patch(`/rooms/${roomId}/amenities/${amenityId}`, { name });
    return response.data;
  },

  /**
   * Delete a single amenity from a room
   * @param {string} roomId
   * @param {string} amenityId
   */
  deleteAmenity: async (roomId, amenityId) => {
    const response = await axiosClient.delete(`/rooms/${roomId}/amenities/${amenityId}`);
    return response.data;
  },

  /**
   * Delete all amenities for a room
   * @param {string} roomId
   */
  deleteAllAmenities: async (roomId) => {
    const response = await axiosClient.delete(`/rooms/${roomId}/amenities/`);
    return response.data;
  },
};

export default amenityService;
