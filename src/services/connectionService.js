import axiosClient from './axiosClient';

const connectionService = {
  getLandlordConnections: async () => {
    const response = await axiosClient.get('/connections/landlord');
    return response.data;
  },
  getTenantConnections: async () => {
    const response = await axiosClient.get('/connections/tenant');
    return response.data;
  },
  getConnectionById: async (id) => {
    const response = await axiosClient.get(`/connections/${id}`);
    return response.data;
  },
  updateConnectionStatus: async (id, status) => {
    const response = await axiosClient.patch(`/connections/${id}/status`, { connection_status: status });
    return response.data;
  },
  getAdminConnections: async () => {
    const response = await axiosClient.get('/connections/admin/all');
    return response.data;
  }
};

export default connectionService;
