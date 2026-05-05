import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TENANT');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password, role, avatar);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-primary-50/30">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-primary-600">🏠 Ghar Bhada</Link>
          <p className="mt-2 text-slate-500">Create your account to get started.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'TENANT', label: '🔍 Find a Room', sub: 'Tenant' },
                  { val: 'LANDLORD', label: '🏡 List Property', sub: 'Landlord' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setRole(r.val)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      role === r.val
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            <div>
              <label htmlFor="reg-pw" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input id="reg-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 8 characters" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Photo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0">
                  {avatarPreview ? <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : (name || 'U').charAt(0).toUpperCase()}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                    Click to upload
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
