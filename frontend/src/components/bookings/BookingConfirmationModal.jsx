import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Printer,
  ArrowRight,
  X,
  QrCode,
} from 'lucide-react';

const BookingConfirmationModal = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(booking.event?.date || booking.createdAt).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-pass-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors print:hidden"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Banner */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your admission pass is generated and recorded in the database.
          </p>
        </div>

        {/* Printable Ticket Pass Body */}
        <div className="border border-slate-200 rounded-2xl bg-gradient-to-b from-indigo-50/30 to-white overflow-hidden shadow-sm relative print:border-slate-800">
          {/* Top Ticket Header */}
          <div className="p-5 border-b border-dashed border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Official Event Pass
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Confirmed
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {booking.event?.title || 'Event Reservation'}
            </h3>

            {/* Reference Copy Box */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Booking Reference:</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold text-slate-900 tracking-wider">
                  {booking.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors print:hidden"
                  title="Copy reference"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="p-5 space-y-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Attendee Name</span>
                <p className="font-bold text-slate-800 truncate">{booking.attendeeName}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Email</span>
                <p className="font-bold text-slate-800 truncate">{booking.attendeeEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Schedule</span>
                <p className="font-semibold text-slate-800">{formattedDate}</p>
                <p className="text-[11px] text-indigo-600">{booking.event?.time}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Venue</span>
                <p className="font-semibold text-slate-800">{booking.event?.venue}</p>
                <p className="text-[11px] text-slate-500">{booking.event?.location}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200 bg-slate-50/50 -mx-5 -mb-5 p-5">
              <div className="flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900">
                  {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat' : 'Seats'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Total Simulated Fee:</span>
                <p className="text-base font-black text-slate-900">
                  {booking.totalAmount === 0 ? 'Complimentary (₹0)' : `₹${booking.totalAmount}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket Pass</span>
          </button>

          <Link
            to="/my-bookings"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <span>View My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
