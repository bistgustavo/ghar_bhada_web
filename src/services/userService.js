import axiosClient from './axiosClient';

/**
 * User Service: All user-related API calls
 * Aligned to FastAPI backend schemas (UserCreate, UserUpdate, UserResponse, PaginatedUsersResponse)
 */

const userService = {
  // ============= AUTH ROUTES (PUBLIC) =============

  /**
   * Register a new user
   * Backend expects multipart/form-data: name, email, password, role, avatar(optional)
   * Returns: { user, access_token, token_type }
   */
  register: async (name, email, password, role = 'TENANT', avatar = null) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const response = await axiosClient.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Login user with email and password (JSON endpoint)
   * Returns: { user, access_token, token_type }
   */
  loginJson: async (email, password) => {
    const response = await axiosClient.post('/users/login/json', {
      email,
      password,
    });
    return response.data;
  },

  // ============= PROFILE ROUTES (AUTHENTICATED) =============

  /**
   * Get current authenticated user's profile
   * Returns: UserResponse { id, name, email, phone, role, avatar_url, ... }
   */
  getProfile: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  /**
   * Update current user's profile
   * Backend expects multipart/form-data for all fields including avatar
   * Fields: name, phone, date_of_birth, gender, marital_status, occupation,
   *         emergency_contact_name, emergency_contact_phone, avatar
   */
  updateProfile: async (updates, avatar = null) => {
    const formData = new FormData();

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const response = await axiosClient.patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Change user password
   * Backend expects JSON: { current_password, new_password }
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosClient.patch('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Remove/delete user's avatar
   */
  removeAvatar: async () => {
    const response = await axiosClient.delete('/users/me/avatar');
    return response.data;
  },

  // ============= ADMIN ROUTES =============

  /**
   * List all users (Admin only)
   * Backend returns: { total, skip, limit, users: [...] }
   */
  listUsers: async (filters = {}) => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });
    const response = await axiosClient.get('/users/', { params });
    return response.data;
  },

  /**
   * Get a specific user's profile (Admin only)
   */
  getUserById: async (userId) => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Activate a user account (Admin only)
   */
  activateUser: async (userId) => {
    const response = await axiosClient.patch(`/users/${userId}/activate`);
    return response.data;
  },

  /**
   * Deactivate a user account (Admin only)
   */
  deactivateUser: async (userId) => {
    const response = await axiosClient.patch(`/users/${userId}/deactivate`);
    return response.data;
  },

  /**
   * Verify a user account (Admin only)
   */
  verifyUser: async (userId) => {
    const response = await axiosClient.patch(`/users/${userId}/verify`);
    return response.data;
  },
};

export default userService;
