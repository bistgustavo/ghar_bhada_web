import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import RoomListingPage from './pages/RoomListingPage';
import RoomDetail from './pages/RoomDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import CreateRoomForm from './pages/CreateRoomForm';

// ── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const { token, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Hide navbar on login/register
  const hideNav = ['/login', '/register'].includes(location.pathname);
  if (hideNav) return null;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium transition-colors px-1 py-1 ${
        location.pathname === to || location.pathname.startsWith(to + '/')
          ? 'text-primary-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-600 shrink-0">
            🏠 <span className="hidden sm:inline">Ghar Bhada</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/rooms', 'Browse Rooms')}
            {token && user?.role === 'LANDLORD' && navLink('/landlord', 'My Listings')}
            {token && user?.role === 'ADMIN' && navLink('/admin', 'Admin')}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!token ? (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
                <Link to="/register" className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all shadow-sm">Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : (user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user?.name || 'Profile'}</span>
                </Link>
                <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">Logout</button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Toggle menu">
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-3 animate-fade-in">
            {navLink('/rooms', 'Browse Rooms')}
            {token && user?.role === 'LANDLORD' && navLink('/landlord', 'My Listings')}
            {token && user?.role === 'ADMIN' && navLink('/admin', 'Admin')}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              {!token ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-600">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold bg-primary-600 text-white text-center px-4 py-2.5 rounded-xl">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-600">My Profile</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm font-medium text-red-600 w-full text-left">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── APP CONTENT ─────────────────────────────────────────────────────────────
function AppContent() {
  const { token, user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomListingPage />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />

        {/* Auth */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/profile" />} />

        {/* Protected */}
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        {/* Landlord */}
        <Route path="/landlord" element={<ProtectedRoute element={<LandlordDashboard />} requiredRole="LANDLORD" />} />
        <Route path="/rooms/create" element={<ProtectedRoute element={<CreateRoomForm />} requiredRole="LANDLORD" />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRole="ADMIN" />} />

        {/* Fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-6xl mb-4">🏠</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
            <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all">Go Home</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
