import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  ArrowLeft,
  AlertCircle,
  Tag,
  Share2,
  CheckCircle,
  Ticket,
} from 'lucide-react';
import eventService from '../../services/eventService';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import BookingModal from '../../components/bookings/BookingModal';
import BookingConfirmationModal from '../../components/bookings/BookingConfirmationModal';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Booking modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(false);
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getEventById(id);
        if (data.success && data.event) {
          setEvent(data.event);
        } else {
          setError(data.message || 'Event not found');
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to retrieve event details. The event may not exist.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    toast.info('Event share link copied to clipboard!', 'Link Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookingSuccess = (newBooking) => {
    setIsBookingOpen(false);
    setConfirmedBooking(newBooking);
    // Dynamically update available seats in view
    if (event) {
      setEvent((prev) => ({
        ...prev,
        availableSeats: Math.max(0, prev.availableSeats - newBooking.seatsBooked),
      }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">{error || 'This event could not be found.'}</p>
        <Link
          to="/events"
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Browse All Events</span>
        </Link>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const isPast = new Date(event.date) < new Date();
  const bookedPercent = Math.min(
    100,
    Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100)
  );

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Event</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Details + Sticky Reservation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Banner */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
            <img
              src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
              }}
            />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-indigo-700 backdrop-blur shadow-sm">
                {event.category}
              </span>
              {event.status === 'cancelled' && (
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                  Cancelled
                </span>
              )}
            </div>
          </div>

          {/* Title & Core Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-xs text-slate-400 mt-2">
                Organized by <span className="font-semibold text-slate-600">{event.organizer?.name || 'SkillOrbit Events Team'}</span>
              </p>
            </div>

            {/* Quick Details Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 text-xs text-slate-700">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Date & Schedule</p>
                  <p className="text-slate-500 mt-0.5">{formattedDate}</p>
                  <p className="text-indigo-600 font-semibold mt-0.5">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Venue & Location</p>
                  <p className="text-slate-500 mt-0.5">{event.venue}</p>
                  <p className="text-slate-600 font-medium mt-0.5">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">About This Event</h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation & Availability Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-24">
            {/* Price Header */}
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ticket Price
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                </span>
                {event.ticketPrice > 0 && (
                  <span className="text-xs text-slate-500 font-medium">/ attendee</span>
                )}
              </div>
            </div>

            {/* Seat Capacity Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold flex items-center space-x-1">
                  <Users className="w-4 h-4 text-slate-400 mr-1" />
                  <span>Available Capacity</span>
                </span>
                <span className={`font-bold ${isSoldOut ? 'text-red-600' : 'text-slate-900'}`}>
                  {event.availableSeats} of {event.capacity} left
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isSoldOut
                      ? 'bg-red-500'
                      : bookedPercent > 80
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${bookedPercent}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400">
                {isSoldOut
                  ? 'All tickets have been reserved for this session.'
                  : `${bookedPercent}% booked — reserve early to guarantee attendance.`}
              </p>
            </div>

            {/* Booking Action Button */}
            <div className="pt-2">
              {isPast ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm cursor-not-allowed text-center"
                >
                  Event Concluded
                </button>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-100 text-amber-700 font-semibold text-sm cursor-not-allowed text-center border border-amber-200"
                >
                  Sold Out
                </button>
              ) : event.status === 'cancelled' ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-red-100 text-red-700 font-semibold text-sm cursor-not-allowed text-center border border-red-200"
                >
                  Event Cancelled
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: location } });
                    } else {
                      setIsBookingOpen(true);
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center space-x-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Book Tickets' : 'Sign In to Book Tickets'}</span>
                </button>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Instant confirmation pass generated upon booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Dialog Modal */}
      {isBookingOpen && (
        <BookingModal
          event={event}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Post-Booking Pass Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
};

export default EventDetails;

