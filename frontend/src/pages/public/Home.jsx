import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  ShieldCheck,
  ArrowRight,
  Database,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Code2,
  Globe,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import TiltCard from '../../components/common/TiltCard';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>SkillOrbit Event Booking System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simple Event Booking with <br />
            <span className="text-indigo-600">Guaranteed Seats</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Find campus workshops, tech conferences, and college symposiums. Book your tickets in seconds with instant digital passes and zero double-booking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all group"
            >
              <span>Browse Scheduled Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm bg-white transition-all"
              >
                Create Account
              </Link>
            ) : isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-sm bg-white transition-all"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-medium text-sm bg-white transition-all"
                >
                  Attendee Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm bg-white transition-all"
                >
                  My Bookings
                </Link>
              </div>
            )}
          </div>

          {/* Quick Value Guarantees */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Seat Availability</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Digital Pass Generation</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Easy Self-Service Cancellation</span>
            </span>
          </div>

          {/* 4 Core System Capabilities */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <TiltCard maxTilt={4} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Guaranteed Seats
                  </div>
                  <div className="text-sm font-bold text-slate-900">Zero Overbooking</div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Seats update live with every booking so you never lose your spot.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Secure Accounts
                  </div>
                  <div className="text-sm font-bold text-slate-900">Protected Login</div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Encrypted passwords and secure tokens keep attendee and admin data safe.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Instant Passes
                  </div>
                  <div className="text-sm font-bold text-slate-900">Digital Event Tickets</div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Get a clean reference code and printable admission pass right after booking.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Organizer Tools
                  </div>
                  <div className="text-sm font-bold text-slate-900">One-Click CSV Reports</div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Download attendee rosters and seat occupancy records anytime.
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything You Need for Events</h2>
          <p className="text-sm text-slate-500 mt-2">
            Built to make event discovery, ticket reservation, and administration smooth and reliable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard maxTilt={5} scale={1.015}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Browse & Search Events</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quickly filter upcoming conferences, workshops, and college fests by category, venue, or keyword with real-time updates.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} scale={1.015}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Simple Ticket Reservation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reserve up to 10 tickets per event, view active admission passes, or cancel anytime with automatic seat restoration.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} scale={1.015}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Admin Controls & Analytics</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Organizers can publish events, track registration trends with visual charts, and export attendee rosters to CSV.
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Developer & Designer Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Developer Photo */}
            <div className="flex-shrink-0">
              <img
                src="/developer.png"
                alt="Cherukuri Venkata Karthikeya"
                className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-xl border border-slate-200 shadow-sm bg-slate-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Developer Details & Bio */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                <Code2 className="w-3.5 h-3.5" />
                <span>Project Architect & Developer</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Cherukuri Venkata Karthikeya
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Full-Stack Developer & UI/UX Designer
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Designed and built the SkillOrbit Event Booking System as a modern full-stack application, featuring concurrency-safe seat reservation, responsive interface design, and end-to-end automated testing.
              </p>

              {/* Skills / Tech Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  React 19 & Vite
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Node.js & Express
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  MongoDB Atlas
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Tailwind CSS
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  REST APIs & E2E Testing
                </span>
              </div>

              {/* External Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href="https://skillorbit-event-booking-system.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Vercel Deployment</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <span className="text-slate-300">•</span>

                <a
                  href="https://github.com/VenkataKarthikeya-eng/skillorbit-event-booking-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
