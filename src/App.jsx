import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { authAPI } from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      authAPI.getProfile()
        .then(data => setRole(data.role))
        .catch(() => setToken(null));
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">Ghar Bhada</Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Home</Link>
                  {!token && <Link to="/login" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Login</Link>}
                  {!token && <Link to="/register" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Register</Link>}
                  {token && <Link to="/profile" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Profile</Link>}
                  {token && role === 'admin' && <Link to="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Admin</Link>}
                </div>
              </div>
              <div className="flex items-center">
                {token && <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Logout</button>}
              </div>
            </div>
          </div>
        </nav>
        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<div className="text-center"><h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to Ghar Bhada</h2><p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">The premier platform to rent and find houses.</p></div>} />
              <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/profile" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/profile" />} />
              <Route path="/profile" element={token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              <Route path="/admin" element={token ? <Admin token={token} /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
