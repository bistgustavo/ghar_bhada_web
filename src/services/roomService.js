import axiosClient from './axiosClient';

/**
 * Room Service: All room-related API calls
 * Aligned to FastAPI backend schemas (RoomCreate, RoomUpdate, RoomResponse, PaginatedRoomsResponse)
 */

const roomService = {
  // ============= PUBLIC ROUTES =============

  /**
   * List all approved and available rooms with advanced filtering
   * Backend returns: { total, skip, limit, rooms: [...] }
   */
  listRooms: async (filters = {}) => {
    const params = { ...filters };
    // Clean undefined/empty params
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    const response = await axiosClient.get('/rooms/', { params });
    return response.data;
  },

  /**
   * Get detailed information about a specific room
   * Note: Backend uses POST for this endpoint
   */
  getRoomById: async (roomId) => {
    const response = await axiosClient.post(`/rooms/${roomId}`);
    return response.data;
  },

  // ============= LANDLORD ROUTES =============

  /**
   * Create a new room listing (Landlord only)
   * Matches RoomCreate schema: title, description, room_type, price_per_month,
   *   address, city, district, province, lat, lng, available_from, rent_note
   */
  createRoom: async (roomData) => {
    const response = await axiosClient.post('/rooms/', roomData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Get all room listings created by the current landlord
   * Backend returns: { total, skip, limit, rooms: [...] }
   */
  getMyListings: async (pagination = {}) => {
    const params = {
      skip: pagination.skip || 0,
      limit: Math.min(pagination.limit || 20, 100),
    };

    const response = await axiosClient.get('/rooms/my/listings', { params });
    return response.data;
  },

  /**
   * Update an existing room listing (Landlord only - must be owner)
   * Matches RoomUpdate schema fields
   */
  updateRoom: async (roomId, updateData) => {
    const response = await axiosClient.patch(`/rooms/update/${roomId}`, updateData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Soft-delete (unlist) a room listing (Landlord only)
   */
  deleteRoom: async (roomId) => {
    const response = await axiosClient.delete(`/rooms/delete/${roomId}`);
    return response.data;
  },

  /**
   * Toggle room availability on/off (Landlord only)
   * Note: Backend route has typo: /toogle-availablity/
   */
  toggleAvailability: async (roomId) => {
    const response = await axiosClient.patch(`/rooms/toogle-availablity/${roomId}`);
    return response.data;
  },

  // ============= ADMIN ROUTES =============

  /**
   * List all room listings with status filter (Admin only)
   * Backend returns: { total, skip, limit, rooms: [...] }
   */
  getAllRooms: async (filters = {}) => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    const response = await axiosClient.get('/rooms/admin/all', { params });
    return response.data;
  },

  /**
   * Review/approve/reject a pending room listing (Admin only)
   */
  reviewRoom: async (roomId, newStatus, adminNote = '') => {
    const response = await axiosClient.patch(`/rooms/admin/${roomId}/review`, null, {
      params: {
        new_status: newStatus,
        admin_note: adminNote,
      },
    });
    return response.data;
  },
};

export default roomService;
