import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  Users,
  Shield,
  Download,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import adminService from '../../services/adminService';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const COLORS = [
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0284c7', // Sky
  '#475569', // Slate
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingBookings, setDownloadingBookings] = useState(false);
  const [downloadingEvents, setDownloadingEvents] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to retrieve administrative statistics');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading admin analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDownloadBookings = async () => {
    setDownloadingBookings(true);
    try {
      await adminService.downloadBookingsCSV();
      toast.success('Bookings report CSV downloaded successfully!', 'Export Ready');
      setFeedback({ type: 'success', message: 'Bookings CSV downloaded successfully!' });
    } catch (err) {
      toast.error('Failed to download bookings CSV report', 'Export Error');
      setFeedback({ type: 'error', message: 'Failed to download bookings CSV report' });
    } finally {
      setDownloadingBookings(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDownloadEvents = async () => {
    setDownloadingEvents(true);
    try {
      await adminService.downloadEventsCSV();
      toast.success('Events summary CSV downloaded successfully!', 'Export Ready');
      setFeedback({ type: 'success', message: 'Events summary CSV downloaded successfully!' });
    } catch (err) {
      toast.error('Failed to download events summary CSV report', 'Export Error');
      setFeedback({ type: 'error', message: 'Failed to download events summary CSV report' });
    } finally {
      setDownloadingEvents(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Analytics Unavailable</h2>
        <p className="text-xs text-red-600">{error}</p>
        <button
          onClick={fetchStats}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { summary, categoryDistribution, bookingTrends, recentBookings } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time MongoDB metrics, booking volume trends, capacity monitoring, and CSV reporting
          </p>
        </div>

        {/* Action Controls & Report Downloads */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadBookings}
            disabled={downloadingBookings}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            title="Export all bookings as CSV"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{downloadingBookings ? 'Exporting...' : 'Export Bookings (CSV)'}</span>
          </button>

          <button
            onClick={handleDownloadEvents}
            disabled={downloadingEvents}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            title="Export event occupancy as CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{downloadingEvents ? 'Exporting...' : 'Export Events (CSV)'}</span>
          </button>

          <Link
            to="/admin/events/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Total Events</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{summary.totalEvents}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.upcomingEvents} upcoming scheduled
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Total Bookings</span>
            <Ticket className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{summary.totalBookings}</div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed reservations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Tickets Reserved</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary.totalTicketsBooked}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total seats booked</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{summary.totalUsers}</div>
          <div className="text-[11px] text-slate-400 mt-1">Students & organizers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Simulated Volume</span>
            <span className="text-xs text-amber-500 font-bold">₹</span>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{summary.totalRevenue}</div>
          <div className="text-[11px] text-slate-400 mt-1">Simulated ticket volume</div>
        </div>
      </div>

      {/* Visual Analytics Charts Powered by Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Trends Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Monthly Reservation Trends</span>
            </h3>
            <span className="text-[11px] text-slate-400">Past 6 Months</span>
          </div>

          <div className="h-64 w-full">
            {bookingTrends.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No historical trend data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={bookingTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    name="Tickets Booked"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTickets)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Category Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-400">All Scheduled Events</span>
          </div>

          <div className="h-64 w-full">
            {categoryDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No events categorized yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    layout="horizontal"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Feed (Database Driven) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Booking Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live registrations recorded in the database
            </p>
          </div>
          <Link
            to="/admin/events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>Manage All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Attendee</th>
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Seats</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{b.attendeeName || b.user?.name}</p>
                      <p className="text-[11px] text-slate-400">{b.attendeeEmail || b.user?.email}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 truncate max-w-[200px]">
                      {b.event?.title || 'Unknown Event'}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {b.seatsBooked} {b.seatsBooked === 1 ? 'ticket' : 'tickets'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
