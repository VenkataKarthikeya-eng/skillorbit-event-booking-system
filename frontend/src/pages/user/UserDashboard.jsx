import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  XCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';
import BookingConfirmationModal from '../../components/bookings/BookingConfirmationModal';

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.getUserDashboard();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to retrieve dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading your dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard Unavailable</h2>
        <p className="text-xs text-red-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { summary, upcomingBookings, recentBookings, discoverEvents } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Attendee Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your reserved event passes, upcoming schedules, and booking activity
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            aria-label="Refresh Dashboard data"
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
          <Link
            to="/my-bookings"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
          >
            <span>My Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.totalBookings}</div>
            <div className="text-xs font-medium text-slate-500">Total Reservations</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{summary.activePasses}</div>
            <div className="text-xs font-medium text-slate-500">Active Passes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{summary.totalTickets}</div>
            <div className="text-xs font-medium text-slate-500">Tickets Reserved</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-700">{summary.cancelledCount}</div>
            <div className="text-xs font-medium text-slate-500">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Upcoming Event Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Upcoming Event Passes</span>
          </h2>
          <Link
            to="/my-bookings"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Upcoming Events Scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any upcoming event passes. Explore our latest campus workshops and summits!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map((b) => {
              const ev = b.event;
              const formattedDate = new Date(ev?.date || b.createdAt).toLocaleDateString(
                'en-US',
                {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              );

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={ev?.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {b.bookingReference}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          Confirmed
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {ev?.title || 'Event Reservation'}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{ev?.time}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1 truncate">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{ev?.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700">
                      {b.seatsBooked} {b.seatsBooked === 1 ? 'Seat' : 'Seats'}
                    </span>
                    <button
                      onClick={() => setSelectedPass(b)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Ticket Pass</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Section: Recent Bookings & Discover Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Booking Activity</h3>
            <Link to="/my-bookings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View History
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent booking records.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <div key={b._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 truncate max-w-[240px]">
                      {b.event?.title || 'Event Booking'}
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">
                      {b.bookingReference} • {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {b.status}
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                      {b.seatsBooked} {b.seatsBooked === 1 ? 'ticket' : 'tickets'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Upcoming Events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recommended for You</h3>
            <Link to="/events" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Browse All
            </Link>
          </div>

          {discoverEvents.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No additional events available.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {discoverEvents.map((ev) => (
                <div key={ev._id} className="py-3 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 mb-1">
                      {ev.category}
                    </span>
                    <p className="font-bold text-slate-800 truncate max-w-[240px]">
                      {ev.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {new Date(ev.date).toLocaleDateString()} • {ev.venue}
                    </p>
                  </div>

                  <Link
                    to={`/events/${ev._id}`}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Pass Modal */}
      {selectedPass && (
        <BookingConfirmationModal
          booking={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
