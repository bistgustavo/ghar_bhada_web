import axiosClient from './axiosClient';

const subscriptionService = {
  initiate: async (room_id) => {
    const response = await axiosClient.post('/subscriptions/initiate', null, { params: { room_id } });
    return response.data;
  },
  verifyPayment: async (data) => {
    const response = await axiosClient.post('/subscriptions/verify-payment', data);
    return response.data;
  },
  getMySubscriptions: async () => {
    const response = await axiosClient.get('/subscriptions/my');
    return response.data;
  },
  getSubscriptionById: async (id) => {
    const response = await axiosClient.get(`/subscriptions/my/${id}`);
    return response.data;
  },
  cancelSubscription: async (id) => {
    const response = await axiosClient.patch(`/subscriptions/my/${id}/cancel`);
    return response.data;
  },
  getRoomSubscriptions: async (room_id) => {
    const response = await axiosClient.get(`/subscriptions/room/${room_id}`);
    return response.data;
  },
  getAllSubscriptions: async () => {
    const response = await axiosClient.get('/subscriptions/admin/all');
    return response.data;
  },
  reviewSubscription: async (id, status, admin_note = '') => {
    const response = await axiosClient.patch(`/subscriptions/admin/${id}/review`, { status, admin_note });
    return response.data;
  }
};

export default subscriptionService;
