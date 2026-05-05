import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

/**
 * AuthContext: Global authentication state management
 * Stores user object, token, and provides logout functionality
 * Supports role-based access control (TENANT, LANDLORD, ADMIN)
 */
export const AuthContext = createContext();

/**
 * AuthProvider: Wraps the application to provide auth state to all components
 * Loads persisted user from localStorage on mount
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const persistedToken = localStorage.getItem('token');
    const persistedUser = localStorage.getItem('user');

    if (persistedToken && persistedUser) {
      try {
        setToken(persistedToken);
        setUser(JSON.parse(persistedUser));
      } catch (err) {
        console.error('Failed to parse persisted user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // Listen for unauthorized events (from axios interceptor)
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  /**
   * Login user and store token and user data
   * @param {string} email
   * @param {string} password
   * @returns {Promise} User object
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await userService.loginJson(email, password);

      const { access_token, user: userData } = response;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);

      return userData;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Register new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} role - 'TENANT' or 'LANDLORD'
   * @param {File} avatar - Optional
   * @returns {Promise} User object
   */
  const register = useCallback(async (name, email, password, role = 'TENANT', avatar = null) => {
    try {
      setError(null);
      const response = await userService.register(name, email, password, role, avatar);

      const { access_token, user: userData } = response;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);

      return userData;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Logout user and clear all auth state
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  /**
   * Update user profile in state (after API call)
   * @param {Object} updatedUser
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!token && !!user;

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Single role or array of roles
   * @returns {boolean}
   */
  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      if (typeof roles === 'string') {
        return user.role === roles;
      }
      return Array.isArray(roles) && roles.includes(user.role);
    },
    [user]
  );

  /**
   * Check if user is tenant
   */
  const isTenant = user?.role === 'TENANT';

  /**
   * Check if user is landlord
   */
  const isLandlord = user?.role === 'LANDLORD';

  /**
   * Check if user is admin
   */
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isTenant,
    isLandlord,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 * Must be used inside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
