import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
});

/**
 * Request Interceptor: Attach JWT Bearer token from localStorage to all requests
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle errors globally
 * - 401 Unauthorized: Clear token and redirect to login (in app-level logic)
 * - Extract error messages from backend HTTPException details
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Backend returned error response
      const status = error.response.status;
      const data = error.response.data;

      // Extract error message from backend
      const errorMessage = data?.detail || data?.message || 'An error occurred';

      // Create custom error object
      const customError = new Error(errorMessage);
      customError.status = status;
      customError.data = data;

      // 401: Unauthorized (token expired, invalid, or user logged out)
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Emit custom event for app-level logout handling
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }

      return Promise.reject(customError);
    } else if (error.request) {
      // Request made but no response received
      const customError = new Error('No response from server. Please check your connection.');
      customError.status = 0;
      return Promise.reject(customError);
    } else {
      // Error in request setup
      return Promise.reject(error);
    }
  }
);

export default axiosClient;
