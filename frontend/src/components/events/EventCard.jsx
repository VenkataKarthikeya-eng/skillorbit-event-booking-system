import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import TiltCard from '../common/TiltCard';

const EventCard = ({ event }) => {
  const isSoldOut = event.availableSeats <= 0;
  const isPast = new Date(event.date) < new Date();
  const bookedPercent = Math.min(
    100,
    Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100)
  );

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TiltCard
      maxTilt={6}
      scale={1.015}
      className="h-full"
    >
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group preserve-3d">
        {/* Banner Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {/* Category Badge (Floating 3D Layer) */}
          <div className="absolute top-3 left-3 translate-z-20">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-indigo-700 backdrop-blur shadow-sm border border-white/20">
              {event.category}
            </span>
          </div>

          {/* Status / Price Badge (Floating 3D Layer) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end translate-z-20">
            {event.status === 'cancelled' ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-600 text-white shadow-sm">
                Cancelled
              </span>
            ) : isPast ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-700 text-white shadow-sm">
                Past Event
              </span>
            ) : isSoldOut ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white shadow-sm">
                Sold Out
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span>{formattedDate}</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{event.venue}, {event.location}</span>
            </div>
          </div>

          {/* Seating Availability Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
                <span>Available Seats</span>
              </span>
              <span className={`font-semibold ${isSoldOut ? 'text-red-600' : 'text-slate-700'}`}>
                {event.availableSeats} / {event.capacity}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-sm h-1.5 overflow-hidden">
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
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              to={`/events/${event._id}`}
              aria-label={`View event details for ${event.title}`}
              className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white group/btn"
            >
              <span>View Event Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default EventCard;
