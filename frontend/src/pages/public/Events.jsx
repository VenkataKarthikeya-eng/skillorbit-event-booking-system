import React, { useState, useEffect } from 'react';
import { Calendar, Search, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import eventService from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import EventFilter from '../../components/events/EventFilter';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEvents({
        category,
        search,
      });
      if (data.success) {
        setEvents(data.events || []);
      } else {
        setError(data.message || 'Failed to load events');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to connect to server. Please check your backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(timer);
  }, [category, search]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Live Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore and reserve seats for conferences, hackathons, college fests, and workshops
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {!loading && `${events.length} event${events.length === 1 ? '' : 's'} available`}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <EventFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        onReset={handleReset}
      />

      {/* Error State */}
      {error && (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold">Unable to fetch events</p>
              <p className="text-red-600 text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse"
            >
              <div className="aspect-video bg-slate-200 w-full"></div>
              <div className="p-5 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                <div className="h-8 bg-slate-200 rounded-xl mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto px-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Events Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {search || category !== 'All'
              ? `No events match your search "${search || category}". Try adjusting your filters or resetting.`
              : 'There are currently no published events scheduled. Please check back later!'}
          </p>
          {(search || category !== 'All') && (
            <button
              onClick={handleReset}
              className="mt-5 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-all shadow-sm"
            >
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
