import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const features = [
  { icon: '🔍', title: 'Easy Search', desc: 'Filter by city, district, room type, and price range to find your ideal place.' },
  { icon: '✅', title: 'Verified Listings', desc: 'Every listing is reviewed and approved by our admin team for quality.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden costs. See the exact monthly rent before you inquire.' },
  { icon: '🏡', title: 'For Landlords', desc: 'List your property in minutes and reach thousands of potential tenants.' },
];

const stats = [
  { value: '500+', label: 'Active Listings' },
  { value: '75+', label: 'Districts Covered' },
  { value: '10K+', label: 'Happy Tenants' },
  { value: '24/7', label: 'Support' },
];

export default function HomePage() {
  const { token, user } = useSelector(state => state.auth);
  const isAuthenticated = !!token && !!user;

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-red-900">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm text-white/90">
              <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
              Nepal's Trusted Rental Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Find Your Perfect
              <span className="block text-red-200">Home in Nepal</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
              Browse verified rooms, flats, and houses across Nepal. Transparent pricing, trusted landlords, and zero hassle.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Browse Rooms
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
                >
                  Create Account
                </Link>
              )}
              {isAuthenticated && user?.role === 'LANDLORD' && (
                <Link
                  to="/rooms/create"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg text-base"
                >
                  ➕ List Your Room
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-3xl lg:text-4xl font-extrabold text-primary-600">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Why Choose <span className="text-primary-600">Ghar Bhada</span>?
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            We make finding and listing rental properties simple, transparent, and trustworthy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-gradient-to-r from-primary-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of tenants and landlords who trust Ghar Bhada for their rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg text-base"
            >
              Start Browsing
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base"
              >
                List Your Property
              </Link>
            )}
            {isAuthenticated && user?.role === 'LANDLORD' && (
              <Link
                to="/rooms/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg text-base"
              >
                ➕ List Your Room
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">🏠 Ghar Bhada</h3>
              <p className="text-sm leading-relaxed">Nepal's trusted platform for finding and listing rental properties with transparency.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/rooms" className="hover:text-white transition-colors">Browse Rooms</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">For Landlords</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/register" className="hover:text-white transition-colors">List Property</Link></li>
                <li><Link to="/landlord" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 support@gharbhada.com</li>
                <li>📍 Kathmandu, Nepal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
            © {new Date().getFullYear()} Ghar Bhada. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
