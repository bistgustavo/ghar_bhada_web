import axiosClient from './axiosClient';

const savedRoomService = {
  getSavedRooms: async (params) => {
    const response = await axiosClient.get('/saved-rooms/', { params });
    return response.data;
  },
  saveRoom: async (room_id) => {
    const response = await axiosClient.post(`/saved-rooms/${room_id}`);
    return response.data;
  },
  unsaveRoom: async (room_id) => {
    const response = await axiosClient.delete(`/saved-rooms/${room_id}`);
    return response.data;
  },
  checkSaved: async (room_id) => {
    const response = await axiosClient.get(`/saved-rooms/${room_id}/check`);
    return response.data;
  }
};

export default savedRoomService;
