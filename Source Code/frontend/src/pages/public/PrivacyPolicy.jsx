import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Legal Documentation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
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
            <span>Introduction & Scope</span>
          </h2>
          <p>
            SkillOrbit Event Booking System ("we", "our", or "platform") operates an online event discovery, ticket reservation, and administrative capacity management service. This Privacy Policy outlines our standards and operational procedures regarding the collection, handling, storage, and protection of attendee and organizer personal data.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Information We Collect</span>
          </h2>
          <p>We collect only the minimum required information necessary to provide booking and account services:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>
              <strong>Account Identification:</strong> Full name, verified email address, phone number (optional), and encrypted password credentials.
            </li>
            <li>
              <strong>Booking Records:</strong> Unique reservation reference codes (e.g. EVT-YYYYMMDD-XXXX), reserved seat counts, event identifiers, attendee contact details for passes, and transaction timestamps.
            </li>
            <li>
              <strong>Operational Logs:</strong> Standard HTTP request logs, browser user agents, and IP addresses recorded strictly for network diagnostics, rate limiting, and malicious activity prevention.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>How We Use Your Data</span>
          </h2>
          <p>Collected information is used strictly for legitimate operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
            <li>Authenticating registered attendees and administrators.</li>
            <li>Processing atomic ticket reservations and maintaining real-time seating availability.</li>
            <li>Generating official digital boarding passes and printable ticket confirmations.</li>
            <li>Enabling self-service reservation cancellations and seat rollbacks.</li>
            <li>Providing organizers with aggregated, anonymized attendance reports and capacity utilization metrics.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>Authentication, Storage & Cookies</span>
          </h2>
          <p>
            The platform utilizes stateless JSON Web Tokens (JWT) for secure session authentication. Tokens are stored in the client browser's standard local storage and sent via authorization headers. We do not use third-party tracking cookies or advertising pixels.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>Data Security Standards</span>
          </h2>
          <p>
            All user passwords are cryptographically salted and hashed using bcrypt with 10 salt rounds prior to persistence. Credentials are never stored in plaintext and are omitted from database query projections by default. Database connectivity is protected through encrypted TLS connections to a secure MongoDB Atlas cluster.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              6
            </span>
            <span>Data Retention & User Rights</span>
          </h2>
          <p>
            Users retain the right to access their account details and review their booking transaction ledger at any time via the User Dashboard and My Bookings page. In the event an attendee cancels a booking, the reservation is marked as cancelled to preserve administrative audit compliance, while seats are returned to the available event pool.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-bold">
              7
            </span>
            <span>Contact & Inquiries</span>
          </h2>
          <p>
            For privacy inquiries or technical clarification regarding this platform, contact the administrative team at{' '}
            <span className="font-semibold text-slate-900">privacy@skillorbit.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
