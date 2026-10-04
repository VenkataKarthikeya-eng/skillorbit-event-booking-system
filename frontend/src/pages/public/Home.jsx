import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, ShieldCheck, ArrowRight, Database, BarChart3, Lock, Cpu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import TiltCard from '../../components/common/TiltCard';
import InteractiveTicket3D from '../../components/home/InteractiveTicket3D';

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Interactive 3D Digital Pass */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Technical Copy & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>SkillOrbit Event Booking System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Event Ticketing & Real-Time <br />
                <span className="text-indigo-600">Capacity Management</span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
                Direct ticket reservations, verified seating availability, and administrative reporting for technical conferences, workshops, and college symposiums. Engineered with atomic database operations to guarantee zero overselling.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
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

              {/* Concurrency & Architecture Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>MongoDB $inc / $gte Atomic Decrement</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stateless JWT Bearer Auth</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Ticket Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <InteractiveTicket3D />
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Interactive 3D digital pass preview • Hover to tilt and inspect depth
              </p>
            </div>
          </div>

          {/* System Capabilities Specifications (No fake counters/reviews) */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <TiltCard maxTilt={5} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-full">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Concurrency Control</div>
                <div className="text-sm font-bold text-slate-900">Atomic Seat Decrement</div>
                <div className="text-xs text-slate-500 mt-1">Guaranteed bounds via MongoDB $gte operations</div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-full">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Access Control</div>
                <div className="text-sm font-bold text-slate-900">Stateless JWT Auth</div>
                <div className="text-xs text-slate-500 mt-1">Bcrypt password salting with role authorization</div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-full">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Digital Passes</div>
                <div className="text-sm font-bold text-slate-900">Formatted Reference</div>
                <div className="text-xs text-slate-500 mt-1">EVT-YYYYMMDD-XXXX unique identifiers</div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} scale={1.01} showGlare={false}>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-full">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Data Reporting</div>
                <div className="text-sm font-bold text-slate-900">RFC 4180 CSV Export</div>
                <div className="text-xs text-slate-500 mt-1">Downloadable attendance and occupancy summaries</div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Core Architecture Modules</h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered with strict separation of concerns across client, API, and database layers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard maxTilt={7} scale={1.02}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between preserve-3d">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100 translate-z-20">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 translate-z-10">Event Discovery & Catalog</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time query filtering across conference, workshop, and symposium categories with full-text search and date sorting.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={7} scale={1.02}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between preserve-3d">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 translate-z-20">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 translate-z-10">Ticket Reservations & Rollback</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Per-user booking caps of 10 seats per event with automated seat restoration on cancellation to protect inventory balance.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={7} scale={1.02}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between preserve-3d">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 translate-z-20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 translate-z-10">Telemetry & Audit Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recharts monthly trend curves, category distributions, and downloadable CSV rosters for physical gate check-in verification.
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>
    </div>
  );
};

export default Home;
