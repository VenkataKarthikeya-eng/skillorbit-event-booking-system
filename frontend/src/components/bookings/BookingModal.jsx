import React, { useState, useEffect } from 'react';
import { X, Ticket, Plus, Minus, Users, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import bookingService from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const BookingModal = ({ event, onClose, onSuccess }) => {
  const { user } = useAuth();
  const toast = useToast();

  const maxAllowed = Math.min(10, event.availableSeats);
  const [seats, setSeats] = useState(1);
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unitPrice = event.ticketPrice || 0;
  const totalAmount = unitPrice * seats;

  const handleIncrement = () => {
    if (seats < maxAllowed) {
      setSeats((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (seats > 1) {
      setSeats((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      setError('Please provide attendee full name and email address');
      return;
    }

    if (seats < 1 || seats > maxAllowed) {
      setError(`Please select between 1 and ${maxAllowed} seats`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingService.createBooking({
        eventId: event._id,
        seatsBooked: seats,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
      });

      if (res.success && res.booking) {
        toast.success(
          `Reserved ${seats} seat(s) for "${event.title}". Reference: ${res.booking.bookingReference}`,
          'Booking Confirmed'
        );
        onSuccess(res.booking);
      } else {
        const msg = res.message || 'Unable to complete reservation';
        setError(msg);
        toast.error(msg, 'Reservation Error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error while processing your reservation';
      setError(msg);
      toast.error(msg, 'Reservation Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3 mb-6 pr-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl flex-shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              Reserve Tickets
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{event.title}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seat Counter Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <span>Select Quantity</span>
              <span className="text-[11px] text-slate-400 lowercase font-normal">
                (max {maxAllowed} seats)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900">Number of Tickets</span>
                <p className="text-[11px] text-slate-500">
                  {event.availableSeats} seat(s) currently remaining
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={seats <= 1 || submitting}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-bold text-base text-slate-900">
                  {seats}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={seats >= maxAllowed || submitting}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Attendee Full Name *
              </label>
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Confirmation Email Address *
              </label>
              <input
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="e.g. attendee@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
          </div>

          {/* Pricing Breakdown (Simulation - No Real Payment) */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Unit Price</span>
              <span>{unitPrice === 0 ? 'Free' : `₹${unitPrice}`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Seats</span>
              <span>× {seats}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-1 border-t border-dashed border-slate-200">
              <span>Total Reservation Amount</span>
              <span className="text-indigo-600">
                {totalAmount === 0 ? 'Complimentary (₹0)' : `₹${totalAmount}`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Simulated billing for student capstone evaluation. No actual charge applies.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={submitting || maxAllowed <= 0}
            className="w-full py-3.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Reserving Seats...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Generate Booking Pass</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
