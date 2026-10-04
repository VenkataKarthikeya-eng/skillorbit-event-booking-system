import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  Eye,
  RefreshCw,
  Printer,
  ArrowRight,
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import BookingConfirmationModal from '../../components/bookings/BookingConfirmationModal';

const MyBookings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // View pass modal state
  const [selectedPass, setSelectedPass] = useState(null);
  const [copiedRef, setCopiedRef] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      } else {
        setError(res.message || 'Failed to retrieve bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCopy = (ref) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      const res = await bookingService.cancelBooking(bookingToCancel._id);
      if (res.success) {
        toast.success(
          `Reservation ${bookingToCancel.bookingReference} cancelled. Reserved seats released.`,
          'Booking Cancelled'
        );
        setFeedback({
          type: 'success',
          message: 'Booking cancelled successfully. Reserved seats have been released.',
        });
        fetchBookings();
      } else {
        const msg = res.message || 'Failed to cancel booking';
        toast.error(msg, 'Cancellation Error');
        setFeedback({
          type: 'error',
          message: msg,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error occurred during cancellation';
      toast.error(msg, 'Cancellation Error');
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setCancelling(false);
      setCancelModalOpen(false);
      setBookingToCancel(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Event Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your booked ticket passes, view reservations, and download tickets
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh bookings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Discover More Events</span>
          </Link>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'confirmed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Passes ({confirmedCount})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'cancelled'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({bookings.length - confirmedCount})
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-48 aspect-video bg-slate-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-bold text-sm">Failed to load bookings</h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto p-8 space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {filter === 'all'
                ? "You haven't booked any event tickets yet. Explore upcoming campus conferences and workshops!"
                : `No ${filter} bookings found in your history.`}
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Browse Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const ev = b.event;
            const isConfirmed = b.status === 'confirmed';
            const eventDate = ev?.date ? new Date(ev.date) : new Date(b.createdAt);
            const isPast = eventDate < new Date();

            const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Event Thumb & Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 flex-1">
                  <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <img
                      src={ev?.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow-sm ${
                          isConfirmed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Booking Reference Pill */}
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                      <span>{b.bookingReference}</span>
                      <button
                        onClick={() => handleCopy(b.bookingReference)}
                        className="p-0.5 hover:bg-slate-200 rounded text-slate-500"
                        title="Copy reference code"
                      >
                        {copiedRef === b.bookingReference ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {ev ? (
                        <Link
                          to={`/events/${ev._id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {ev.title}
                        </Link>
                      ) : (
                        'Event Reservation'
                      )}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{formattedDate}</span>
                      </span>

                      {ev?.time && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{ev.time}</span>
                        </span>
                      )}

                      {ev?.venue && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[160px]">{ev.venue}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1">
                      Reserved for <span className="font-semibold text-slate-700">{b.attendeeName}</span> ({b.attendeeEmail})
                    </div>
                  </div>
                </div>

                {/* Right Column: Quantity & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-500 font-medium">
                      {b.seatsBooked} {b.seatsBooked === 1 ? 'Ticket' : 'Tickets'}
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {b.totalAmount === 0 ? 'Complimentary' : `₹${b.totalAmount}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPass(b)}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                      title="View Pass"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>

                    {isConfirmed && !isPast && (
                      <button
                        onClick={() => openCancelModal(b)}
                        className="px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors"
                        title="Cancel reservation"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && bookingToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !cancelling) setCancelModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 id="cancel-modal-title" className="text-lg font-bold text-slate-900">Cancel Ticket Reservation</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to cancel booking <span className="font-mono font-bold text-slate-800">{bookingToCancel.bookingReference}</span>?
                The {bookingToCancel.seatsBooked} reserved seat(s) will be immediately returned to the event's available capacity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
                className="py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancelling}
                className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MyBookings;
