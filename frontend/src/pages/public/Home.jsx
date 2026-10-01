import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SkillOrbit Web Development Capstone</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover, Book & Attend <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exciting Live Events
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            The full-featured online booking platform. Browse trending conferences, technical workshops, college fests, and concerts with atomic real-time seat reservation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-200 transition-all group"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-medium text-sm bg-slate-50 transition-all"
              >
                Create Free Account
              </Link>
            ) : isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-purple-300 hover:bg-purple-50 text-purple-700 font-medium text-sm bg-white transition-all"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-medium text-sm bg-white transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm bg-white transition-all"
                >
                  My Bookings
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Real-Time Seat Accuracy</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">JWT</div>
              <div className="text-xs text-slate-500 font-medium">Role-Based Security</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">Instant</div>
              <div className="text-xs text-slate-500 font-medium">Booking Confirmations</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">CSV</div>
              <div className="text-xs text-slate-500 font-medium">Admin Report Exports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Complete Event Life-Cycle</h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered to fulfill all 5 SkillOrbit modules end-to-end
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Event Discovery & Filters</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find technical conferences, workshops, concerts, and fests with keyword search and category filtering.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Safe Ticket Reservation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Atomic database operations ensure remaining seats are decremented without race conditions or negative capacity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Analytics & Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organizers access live database metrics, booking trends, capacity utilization, and downloadable CSV summaries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
