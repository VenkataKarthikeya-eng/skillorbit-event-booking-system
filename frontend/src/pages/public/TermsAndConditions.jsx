import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-slate-200">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Terms of Service</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Effective Date: October 1, 2026 | Last Updated: October 2026
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-600 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Agreement to Terms</span>
          </h2>
          <p>
            By accessing or using the SkillOrbit Event Booking System ("SkillOrbit", "the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to all provisions contained herein, you must refrain from registering an account, booking tickets, or accessing administrative interfaces.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Account Registration & Responsibilities</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>You must provide accurate, current, and complete registration information during account creation.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
            <li>Accounts are strictly non-transferable. Impersonation of other attendees or organizers is prohibited.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>Ticket Reservation & Capacity Rules</span>
          </h2>
          <p>The platform enforces strict rules to guarantee fairness and concurrency safety:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>
              <strong>Per-Transaction Limit:</strong> A single booking transaction allows reservation of between 1 and 10 tickets, subject to real-time available capacity.
            </li>
            <li>
              <strong>Per-User Limit:</strong> To prevent ticket hoarding and preserve fair allocation, each attendee account is capped at a cumulative maximum of 10 confirmed tickets per event.
            </li>
            <li>
              <strong>Atomic Inventory:</strong> Seating availability is decremented atomically. In high-demand scenarios, the platform allocates seats based on exact millisecond timestamp verification. Requests submitted after capacity is reached are rejected with an explicit sold-out notification.
            </li>
            <li>
              <strong>Simulated Pricing:</strong> Ticket prices listed on the platform represent simulated currency values for demonstration and educational tracking purposes unless explicitly noted.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>Cancellation & Seat Rollback Policy</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>Attendees may cancel their confirmed bookings prior to the event date through the My Bookings portal.</li>
            <li>Upon cancellation, the reserved seats are atomically restored to the event's available seating pool for other attendees.</li>
            <li>Cancelled tickets cannot be reinstated. A new booking must be placed if tickets remain available.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>Event Management & Organizer Authority</span>
          </h2>
          <p>
            Authorized administrators reserve the right to schedule, update, reschedule, or cancel events based on venue constraints. If an event with active bookings is cancelled by an organizer, the event status is preserved in the database to safeguard historical audit trails.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              6
            </span>
            <span>Limitation of Liability</span>
          </h2>
          <p>
            The SkillOrbit platform is provided "as is" and "as available". We do not guarantee uninterrupted server availability or liability for scheduling changes made by third-party campus organizers.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              7
            </span>
            <span>Governing Law & Contact</span>
          </h2>
          <p>
            These terms are governed by standard applicable commercial regulations. Questions regarding these terms may be directed to{' '}
            <span className="font-semibold text-slate-900">legal@skillorbit.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
