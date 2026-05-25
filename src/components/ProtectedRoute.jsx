import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute: Restricts route access based on authentication and role
 * 
 * @param {Object} props
 * @param {React.Component} props.element - Component to render if access granted
 * @param {string|string[]} props.requiredRole - Single role or array of allowed roles
 *                                             Pass null/undefined to check only auth
 * @param {string} props.redirectTo - Route to redirect unauthorized users (default: '/login')
 * @param {boolean} props.fallback - Show loading fallback while checking auth (default: true)
 * 
 * @example
 * // Only authenticated users
 * <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
 * 
 * // Only landlords
 * <Route path="/landlord/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole="LANDLORD" />} />
 * 
 * // Admin or Landlord
 * <Route path="/manage" element={<ProtectedRoute element={<Manage />} requiredRole={['ADMIN', 'LANDLORD']} />} />
 */
export function ProtectedRoute({
  element,
  requiredRole = null,
  redirectTo = '/login',
  fallback = true,
}) {
  const { token, loading, user } = useSelector(state => state.auth);
  const isAuthenticated = !!token && !!user;
  
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return Array.isArray(roles) && roles.includes(user.role);
  };

  // Show loading while checking auth state
  if (loading && fallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Your role: <span className="font-semibold">{user?.role}</span></p>
          <a href="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return element;
}

export default ProtectedRoute;
