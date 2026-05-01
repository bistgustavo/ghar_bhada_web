import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username'
    formData.append('password', password);
    const response = await api.post('/users/login', formData);
    return response.data;
  },
  register: async (formData) => {
    const response = await api.post('/users/register', formData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (formData) => {
    const response = await api.patch('/users/me', formData);
    return response.data;
  },
  changePassword: async (current_password, new_password) => {
    const response = await api.patch('/users/me/password', { current_password, new_password });
    return response.data;
  },
  removeAvatar: async () => {
    const response = await api.delete('/users/me/avatar');
    return response.data;
  },
  listUsers: async (params = {}) => {
    const response = await api.get('/users/', { params });
    return response.data;
  }
};

export default api;
