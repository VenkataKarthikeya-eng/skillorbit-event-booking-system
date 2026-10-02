import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, ShieldCheck, ArrowRight, BarChart3 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="pb-16">
      <section className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-indigo-700 mb-4">
              SKILLORBIT EVENTS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Find an event. Reserve your seats. Keep your booking organized.
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed mt-6">
              Browse upcoming events, review schedules and venues, reserve available seats,
              and manage your bookings from one place.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                <span>Browse Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!isAuthenticated ? (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-lg transition-colors"
                >
                  Create an Account
                </Link>
              ) : isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-lg transition-colors"
                >
                  Open Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-lg transition-colors"
                >
                  Open My Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-7 sm:p-8 rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              What you can do
            </p>
            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Browse upcoming events</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Search by event name, venue, and category before opening the full event details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Reserve available seats</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Select ticket quantities based on the seats currently available for an event.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Manage your bookings</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Review confirmations and booking history after signing in.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Run event reports</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Administrators can review booking activity and export available reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-indigo-700">PLATFORM WORKFLOW</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-2">
            A straightforward event booking workflow
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            The platform keeps event discovery, booking, confirmation, and administration in one
            consistent flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500">01</p>
            <h3 className="text-base font-bold text-slate-900 mt-3">Discover</h3>
            <p className="text-sm text-slate-600 mt-2">
              Search and filter published events, then review date, time, venue, and available seats.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500">02</p>
            <h3 className="text-base font-bold text-slate-900 mt-3">Book</h3>
            <p className="text-sm text-slate-600 mt-2">
              Choose the number of tickets and complete the reservation when seats are available.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500">03</p>
            <h3 className="text-base font-bold text-slate-900 mt-3">Manage</h3>
            <p className="text-sm text-slate-600 mt-2">
              View booking history as a user, or manage events and reports as an administrator.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
