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
  Mail,
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
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>SkillOrbit Event Booking System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simple Event Booking with <br />
            <span className="text-blue-700">Real-Time Seat Availability</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Find campus workshops, tech conferences, and college symposiums. Book tickets with real-time availability, digital confirmations, and concurrency-safe seat reservations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm shadow-sm transition-all group"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 font-medium text-sm bg-white transition-all"
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
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
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
                className="w-32 h-40 sm:w-36 sm:h-44 object-cover object-top rounded-xl border border-slate-200 shadow-sm bg-slate-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Developer Details & Bio */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <Code2 className="w-3.5 h-3.5 text-blue-700" />
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

              {/* Contact & Social Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href="https://www.linkedin.com/in/cherukuri-venkata-karthikeya-4b54393ab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <span className="text-slate-300">•</span>

                <a
                  href="mailto:venkatakarthikeya2005@gmail.com"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>venkatakarthikeya2005@gmail.com</span>
                </a>

                <span className="text-slate-300">•</span>

                <a
                  href="https://github.com/VenkataKarthikeya-eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
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
