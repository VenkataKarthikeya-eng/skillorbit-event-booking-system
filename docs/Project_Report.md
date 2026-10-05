# Project Report
## SkillOrbit: Enterprise Web Development Capstone Project — Event Booking System

---

## 1. Title Page

- **Project Title:** SkillOrbit Event Booking & Management System
- **Curriculum Domain:** Full-Stack Web Development Capstone Project
- **Developer & Lead Engineer:** Cherukuri Venkata Karthikeya
- **Architectural Pattern:** Decoupled Client-Server REST Architecture (MERN Stack)
- **Frontend Framework:** React 19 (Vite, Tailwind CSS, Lucide Icons, Recharts)
- **Backend Framework:** Node.js, Express.js (RESTful API, Multer, json2csv)
- **Database Engine:** MongoDB Atlas (Mongoose ODM 8.9+)
- **Live Production Deployments:**
  - **Frontend Application:** [https://skillorbit-event-booking-system.vercel.app/](https://skillorbit-event-booking-system.vercel.app/)
  - **Backend API Service:** [https://skillorbit-backend.onrender.com](https://skillorbit-backend.onrender.com)
- **Source Code Repository:** VenkataKarthikeya-eng/skillorbit-event-booking-system
- **Academic Evaluation Date:** October 2026

---

## 2. Abstract

Managing event registrations for institutional conferences, collegiate symposiums, technical bootcamps, and competitive hackathons requires a reliable, transparent, and scalable booking infrastructure. Traditional spreadsheet workflows and legacy web forms frequently suffer from concurrency race conditions, resulting in overbooking, duplicate seat allocations, lack of immediate attendee confirmation, and absence of administrative analytics.

The **SkillOrbit Event Booking System** is an enterprise-grade full-stack web application engineered to solve these core operational challenges. Built on the modern MERN stack (MongoDB, Express.js, React 19, Node.js) with Tailwind CSS, the platform delivers:
1. **Dynamic Catalog Discovery:** A public event catalog featuring real-time category filtering, full-text multi-field search, and availability badges.
2. **Concurrency-Safe Atomic Ticketing:** An atomic reservation engine using MongoDB's `$gte` conditional query and `$inc` decrement operator to guarantee zero overselling under simultaneous requests.
3. **Anti-Double-Booking Guard:** A strict business rule capping reservations at a maximum of 10 cumulative tickets per attendee per event.
4. **Digital Boarding Pass Generation:** Immediate generation of unique booking reference codes (`EVT-YYYYMMDD-XXXX`) and responsive printable digital ticket modals with complete event snapshots.
5. **Self-Service Attendee Management:** An attendee dashboard allowing users to view upcoming events, track active passes, and execute cancellations with automated atomic seat inventory rollback.
6. **Executive Admin Dashboard:** Real-time administrative business intelligence featuring dynamic analytics (monthly registration curves and category distributions) alongside one-click RFC 4180 CSV export pipelines.
7. **Comprehensive Automated Verification:** An exhaustive test suite comprising 77 automated integration and unit test scenarios achieving a 100% pass rate.

---

## 3. Introduction

Educational and professional institutions organize a high volume of events each year, including technical workshops, guest lectures, cultural fests, hackathons, and corporate seminars. Efficiently coordinating attendee registration is vital for logistical planning, physical hall capacity compliance, and attendee satisfaction.

SkillOrbit was conceived to bridge the gap between simple static registration forms and complex commercial ticketing engines. It provides educational institutions and tech event organizers with a purpose-built, responsive, and secure web application. The platform provides a transparent experience for attendees while equipping organizers with tools to manage capacities, monitor registration momentum, prevent race conditions, and export attendee rosters.

---

## 4. Problem Statement

Manual registration methods and legacy web platforms exhibit critical technical shortcomings:
1. **Concurrency Race Conditions:** In high-demand scenarios (e.g., keynote sessions or workshops with limited seats), simultaneous submissions lead to database race conditions where more tickets are issued than the physical room capacity allows.
2. **Ticket Hoarding & Double Booking:** Unchecked registration workflows allow single users to submit multiple forms, monopolizing seats and depriving other attendees of opportunities.
3. **Lack of Instant Digital Pass Verification:** Attendees often receive delayed email responses without human-readable reference identifiers or printable admission passes.
4. **Complex or Non-Existent Cancellation Handling:** Attendees unable to attend have no self-service mechanism to cancel reservations. As a result, unused seats remain occupied in the database and empty at the venue.
5. **Absence of Real-Time Analytics:** Organizers lack real-time visibility into occupancy rates and registration velocity across categories, complicating room allocation and catering planning.

---

## 5. Objectives

The primary engineering objectives of the SkillOrbit project are:
- **Zero Overselling Guarantee:** Enforce atomic database transactions to guarantee that physical seat capacities are never exceeded.
- **Anti-Hoarding Seat Protection:** Impose a strict ceiling of 10 cumulative tickets per user per event.
- **Stateless & Secure Authentication:** Implement JWT-based authentication paired with bcrypt password hashing (10 salt rounds) and Role-Based Access Control (RBAC).
- **Sub-Second Discovery & Search:** Deliver responsive client-side and server-side filtering across categories and keywords.
- **Instant Digital Ticket Generation:** Produce unique, human-readable reference codes (`EVT-YYYYMMDD-XXXX`) and styled printable boarding passes upon booking confirmation.
- **Automated Seat Rollback:** Restore reserved seats to the event inventory automatically when an attendee cancels their booking.
- **Executive Telemetry & Data Portability:** Provide real-time data visualization via Recharts and RFC 4180 compliant CSV exports for offline check-ins.
- **Full Automated Test Coverage:** Validate all critical business logic and security policies with 77 automated test scenarios.

---

## 6. Proposed Solution

SkillOrbit introduces a decoupled client-server web architecture designed to resolve these challenges:
- **Frontend Layer:** Built with React 19 and Vite for rapid development and rendering. Tailwind CSS provides a clean, responsive interface without bloated UI dependencies. React Router handles client-side routing with role-protected route guards.
- **Backend API Layer:** An Express.js REST application operating on Node.js, structured into controllers, middleware, and models. Centralized error handling and database connection watchdogs ensure stability.
- **Persistence Layer:** MongoDB Atlas cloud database managed through Mongoose 8.9 ODM. The data model uses relational document references with selective denormalization for historical audit immutability.
- **Atomic Operations Engine:** MongoDB's native atomic operators (`findOneAndUpdate` with `$gte` and `$inc`) handle seat reservation and cancellation, eliminating the need for heavy distributed locking mechanisms.

---

## 7. Functional Requirements

### 7.1 Attendee (User) Capabilities
- **Account Registration:** Register with name, unique email, password, and optional contact number.
- **Authentication:** Log in to receive a secure JWT token; view profile information.
- **Event Catalog Browsing:** Browse published events with details on dates, venues, organizers, and remaining seats.
- **Search & Filtering:** Search by keyword across title, description, venue, and filter by 10 categories.
- **Ticket Booking:** Reserve between 1 and 10 tickets in a single transaction, subject to cumulative limits.
- **Digital Pass View:** View and print digital booking confirmation passes with reference codes.
- **User Dashboard:** Track upcoming confirmed reservations, view recent bookings, and discover new events.
- **Self-Service Cancellation:** Cancel active bookings with instant seat inventory restoration.

### 7.2 Administrator (Organizer) Capabilities
- **Event Lifecycle Management:** Create, publish, edit, and delete events.
- **Capacity Adjustment:** Modify event capacity dynamically while ensuring the limit does not fall below already booked seats.
- **Safe Soft Deletion:** Automatically convert event deletion to a soft cancellation (`status: 'cancelled'`) if confirmed attendee bookings exist.
- **Media Upload:** Upload promotional event banner images via multipart form handling.
- **Executive Analytics:** Monitor total events, active attendees, tickets booked, total revenue, category distribution, and monthly booking trends.
- **Attendee Roster Management:** Inspect complete booking histories across all users.
- **User Account Oversight:** View all registered platform users with timestamps and roles.
- **CSV Data Export:** Generate and download bookings reports and event occupancy summaries.

---

## 8. Non-Functional Requirements

- **Performance:** Sub-100ms API response times for indexed queries; client-side bundle size under 350 KB gzipped.
- **Concurrency Safety:** Deterministic seat inventory under high concurrent load; zero double-booking or capacity overselling.
- **Security:** Passwords hashed with bcrypt (salt rounds: 10); JWT tokens signed with HMAC SHA-256; CORS origin whitelisting; MongoDB injection protection via Mongoose schema binding.
- **Reliability & Availability:** Database connection watchdog middleware (`checkDbConnection`); graceful error handling with custom 404 and 500 JSON error handlers.
- **Usability & Accessibility:** Mobile-first responsive layout; clean typography; semantic HTML elements; visible keyboard focus states; ARIA modal dialogs.
- **Maintainability:** Modular MVC architecture; strict environment variable separation; clear Git history and reproducible build steps.

---

## 9. Technology Stack

### 9.1 Core Stack Specifications
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v20 LTS / v22 | Asynchronous JavaScript runtime environment |
| **Backend Framework** | Express.js | ^4.19.2 | High-performance HTTP REST framework |
| **Database** | MongoDB Atlas | 7.0+ | Cloud-native document database |
| **Object Data Modeling** | Mongoose | ^8.9.0 | Schema enforcement, validation, and lifecycle hooks |
| **Frontend Library** | React | ^19.0.0 | Component-driven declarative UI library |
| **Build Tool** | Vite | ^6.0.5 | Modern fast frontend development server & bundler |
| **Styling** | Tailwind CSS | ^3.4.17 | Utility-first CSS framework |
| **Icons** | Lucide React | ^0.468.0 | Clean, accessible vector UI icons |
| **Charting Engine** | Recharts | ^2.15.0 | SVG charting for administrative dashboards |
| **Client Routing** | React Router DOM | ^7.1.0 | Declarative client-side routing & route guards |
| **Testing Framework** | Jest & Supertest | ^29.7.0 | Automated unit and integration testing suite |

---

## 10. System Architecture

SkillOrbit adopts a decoupled, stateless Client-Server REST architecture:

```
[ Client Browser: React 19 SPA ]
        │  ▲
        │  │ HTTP / JSON Requests (Bearer JWT)
        ▼  │
[ Express.js REST API Server ]
   ├── Authentication Middleware (JWT Verification)
   ├── Role Middleware (User / Admin Authorization)
   ├── Database Watchdog Middleware (Connection Verification)
   ├── Controllers (Business Logic & Validation)
   └── Centralized Error Handling Middleware
        │  ▲
        │  │ Mongoose ODM Operations (Atomic $gte / $inc)
        ▼  │
[ MongoDB Atlas Managed Cluster ]
   ├── users collection (B-Tree index on email)
   ├── events collection (Compound, single, and text indexes)
   └── bookings collection (Unique reference & compound user index)
```

### Architectural Guarantees:
- **Stateless REST Communication:** Every request carries its own authentication credentials via the standard `Authorization: Bearer <token>` header. The server holds no session state in memory.
- **Database Watchdog Guard:** The `checkDbConnection` middleware validates database connectivity prior to query execution, returning a structured 503 Service Unavailable if the connection drops.
- **Centralized Error Propagation:** Unhandled asynchronous errors pass cleanly through Express `next(error)` to a standardized `errorHandler` middleware.

---

## 11. Authentication and Authorization

### 11.1 Authentication Workflow
1. **Attendee Registration:**
   - User submits `name`, `email`, `password`, and optional `phone` to `POST /api/auth/register`.
   - The password is encrypted using `bcryptjs` with 10 salt rounds in a pre-save Mongoose hook.
   - The user document is stored with `role: 'user'` and a signed JWT token is returned.
2. **User Login:**
   - Attendee or administrator submits credentials to `POST /api/auth/login`.
   - The user record is queried with `.select('+password')`.
   - `bcrypt.compare()` verifies the plain password against the stored cryptographic hash.
   - A signed JWT token is issued containing payload `{ id, role, email }` with a 30-day expiration.
3. **Session Rehydration:**
   - On page load, the React application checks `localStorage` for a cached token.
   - If present, `GET /api/auth/me` validates the token against the backend and rehydrates the authenticated user context.

### 11.2 Role-Based Access Control (RBAC)
Role validation is enforced at both the API and client-routing layers:
- **API Guard:** The `authorize('admin')` middleware inspects `req.user.role`. If the role is not `'admin'`, it halts execution and returns HTTP `403 Forbidden`.
- **Client Route Guard:** The `<ProtectedRoute allowedRoles={['admin']}>` React component redirects unauthorized attendees to the home page while alerting them via toast notifications.

---

## 12. Event Management

Administrative event lifecycle workflows allow organizers to create, manage, and monitor events:
- **Event Creation:** Administrators define title, description, category, date, time, venue, location, total capacity, ticket price, and banner URL via `POST /api/events`.
- **Initial Inventory Setup:** Upon creation, `availableSeats` is initialized to match `capacity`.
- **Dynamic Capacity Management:** When updating capacity via `PUT /api/events/:id`, the system computes already booked seats (`capacity - availableSeats`). Capacity cannot be reduced below the number of confirmed attendee tickets.
- **Safe Soft Deletion:** To protect historical records and attendee commitments, `DELETE /api/events/:id` checks for confirmed bookings. If confirmed bookings exist, the event status is set to `'cancelled'` rather than hard-deleting the document.

---

## 13. Event Discovery and Seat Availability

### 13.1 Catalog Browsing & Search
The event discovery catalog (`GET /api/events`) provides multi-parameter filtering:
- **Category Tabs:** Filter by 10 standard categories (`'Technology'`, `'Workshops'`, `'Conferences'`, `'Design'`, `'Business'`, `'Cultural'`, `'Sports'`, `'Academic'`, `'Hackathon'`, `'Other'`).
- **Multi-Field Text Search:** Case-insensitive search matching against `title`, `description`, `venue`, and `location`.
- **Upcoming Filter:** Restricts listings to events scheduled for current or future dates.

### 13.2 Real-Time Availability Indicators
Event cards present visual seat inventory indicators:
- **Available:** Displays exact remaining seats and total capacity.
- **Low Availability Warning:** Badges indicating limited seats (e.g., "Only 3 seats remaining") when inventory falls below 15% of capacity.
- **Sold Out Guard:** Badges indicating "Sold Out" when `availableSeats === 0`, with the booking CTA button disabled.

---

## 14. Ticket Booking

The ticket booking workflow is designed for speed, clarity, and safety:
1. **Selection:** The attendee selects the quantity of tickets (1 to 10) on the event details page.
2. **Snapshot Calculation:** The total amount is computed based on `ticketPrice * seatsBooked`.
3. **Submission:** The client dispatches a request to `POST /api/bookings`.
4. **Validation:** The server validates input formats, date validity, and user limits.
5. **Execution:** The atomic reservation engine allocates the requested seats.
6. **Confirmation:** The server returns the confirmed booking document with a unique reference code, triggering the digital pass modal.

---

## 15. Concurrency-Safe Booking

### 15.1 The Concurrency Race Condition Problem
In standard web applications, ticket booking is typically handled in two distinct database operations:
```javascript
// NAIVE VULNERABLE APPROACH (DO NOT USE)
const event = await Event.findById(eventId);
if (event.availableSeats >= requestedSeats) {
  event.availableSeats -= requestedSeats;
  await event.save(); // VULNERABLE TO RACE CONDITIONS
  await Booking.create(...);
}
```
If two requests execute the read query simultaneously when only 1 seat remains, both read `availableSeats = 1`, both pass the validation, and both write decrements, resulting in `availableSeats = -1` (an illegal overbooked state).

### 15.2 The SkillOrbit Atomic Solution
SkillOrbit avoids race conditions by delegating conditional decrementing directly to the MongoDB engine via an atomic `findOneAndUpdate` operation:

```javascript
// SKILLORBIT CONCURRENCY-SAFE ATOMIC DECREMENT
const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    status: 'published',
    availableSeats: { $gte: seats }
  },
  {
    $inc: { availableSeats: -seats }
  },
  { new: true }
);

if (!event) {
  return res.status(400).json({
    success: false,
    message: 'Insufficient seats available or event is sold out.'
  });
}
```
Because MongoDB guarantees document-level write atomicity, concurrent operations are serialized at the document lock level. If two requests compete for the final seat, only one can satisfy `{ availableSeats: { $gte: seats } }`. The second operation fails the condition and receives `null`, returning HTTP 400 without overselling.

---

## 16. Booking Cancellation

Attendees can cancel active bookings through their self-service dashboard (`PUT /api/bookings/:id/cancel`):
1. **Ownership Authorization:** The server confirms that the authenticated user owns the booking or possesses an administrator role.
2. **Status Guard:** Verifies that the reservation has not already been cancelled.
3. **Status Transition:** The booking status transitions from `'confirmed'` to `'cancelled'`.
4. **Atomic Inventory Reversal:** The event's `availableSeats` count is atomically incremented by the released seat count:
   ```javascript
   await Event.findByIdAndUpdate(booking.event, {
     $inc: { availableSeats: booking.seatsBooked }
   });
   ```
5. **Immediate UI Update:** The attendee dashboard refreshes immediately, updating active pass counts and seat availability.

---

## 17. Digital Booking Confirmation / Ticket Generation

Upon booking confirmation, SkillOrbit generates a digital boarding pass with unique tracking details:
- **Reference Identifier:** An algorithmically formatted string in the format `EVT-YYYYMMDD-XXXX` (e.g., `EVT-20261004-9842`).
- **Pass Details:** Includes attendee name, registered email, event title, category, date, time, venue, seat count, unit price, and total amount.
- **Visual Presentation:** Displayed in a responsive ticket modal featuring clean typography, ticket notch accents, and a verification badge.
- **Print & Save Support:** Equipped with a one-click "Print / Save Pass" button utilizing browser print stylesheets to produce clean paper or PDF passes for venue check-in.

---

## 18. Admin Operations and Analytics

The SkillOrbit Admin Portal (`/admin`) provides organizers with real-time operational telemetry:
- **Summary Metrics:** Real-time counters showing total events, published events, upcoming events, registered users, total bookings, total tickets sold, and platform revenue.
- **Category Breakdown Chart:** Interactive Recharts Donut Pie Chart displaying the percentage distribution of events across categories.
- **Monthly Registration Curve:** Recharts Area Chart displaying monthly booking volume and ticket sales trends over the past six months.
- **Recent Registrations Roster:** Live feed of the latest bookings with attendee names, timestamps, and pass statuses.
- **User Management Portal:** Directory of all registered users with account creation dates and privilege levels.

---

## 19. CSV Export and Reporting

SkillOrbit provides RFC 4180 compliant CSV export pipelines for offline logistics:
1. **Bookings Roster Export (`GET /api/reports/bookings/csv`):**
   - Columns: `BookingReference`, `AttendeeName`, `AttendeeEmail`, `EventTitle`, `EventDate`, `Venue`, `TicketsBooked`, `UnitPrice`, `TotalAmount`, `Status`, `BookingDate`.
   - Used for gate check-in, registration desk verification, and financial reconciliations.
2. **Events Occupancy Export (`GET /api/reports/events/csv`):**
   - Columns: `EventId`, `Title`, `Category`, `Date`, `Time`, `Venue`, `Location`, `TotalCapacity`, `AvailableSeats`, `BookedSeats`, `OccupancyPercent`, `Status`, `TicketPrice`.
   - Used for capacity planning, venue utilization audits, and administrative reporting.

---

## 20. Database Design and Data Models

The database schema utilizes MongoDB Atlas with Mongoose ODM, structured into three primary collections:

### 20.1 Collections Overview
1. **`users` Collection:** Stores user identity credentials, contact details, and role assignments (`'user'` or `'admin'`). Passwords are protected via bcrypt (10 rounds) and excluded from queries by default (`select: false`).
2. **`events` Collection:** Stores event schedules, venue locations, categorization, pricing, total capacity, remaining seats, and publishing status.
3. **`bookings` Collection:** Stores reservation transactions, attendee snapshot names, emails, snapshot unit prices, total costs, and booking status.

### 20.2 Indexing Architecture
- `users`: `{ email: 1 }` (unique B-tree index).
- `events`: `{ date: 1, status: 1 }` (compound index for catalog sorting), `{ category: 1 }`, and text index on `{ title, description, venue }`.
- `bookings`: `{ bookingReference: 1 }` (unique index), `{ user: 1, createdAt: -1 }` (compound index for user history), and `{ event: 1 }`.

---

## 21. Frontend Architecture and User Experience

### 21.1 Architecture & State Management
- **React 19 & Vite:** Fast client-side rendering with standard functional components and hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Context API:** Centralized `AuthContext` managing authentication state, token persistence, and login/logout workflows.
- **Declarative Route Guards:** Custom `<ProtectedRoute>` wrapper inspecting user authentication status and role claims.

### 21.2 Design Language & UX Principles
- **No White-Label Clutter:** The interface avoids purple gradients, pill buttons, fake counters, stock photos, or distracting animations.
- **Restrained Professional Palette:** Deep slate and navy tones (`#0F172A`, `#1E293B`, `#0284C7`) paired with clean neutral backgrounds (`#F8FAFC`, `#FFFFFF`) and emerald status accents (`#059669`).
- **Instant Visual Feedback:** Custom non-intrusive toast notification system providing feedback for logins, bookings, cancellations, and validation errors.

---

## 22. Security Architecture

1. **Cryptographic Password Security:** Plain passwords are never stored in the database. Hashes are generated using `bcryptjs` with 10 salt rounds.
2. **Stateless JWT Tokens:** Authentication tokens are signed using HMAC SHA-256 with an environment-configured secret key.
3. **Role-Based API Protection:** Protected endpoints enforce access control via middleware guards, rejecting non-admin attempts on management routes with HTTP 403.
4. **Data Injection Defense:** Mongoose schema definitions sanitize and cast query parameters, mitigating NoSQL injection vulnerabilities.
5. **CORS Whitelisting:** Express CORS middleware allows requests from configured origins while denying unauthorized cross-origin access.
6. **Sensitive Data Filtering:** User queries automatically exclude password hashes (`select: false`), preventing accidental exposure in API responses.

---

## 23. Deployment and Infrastructure

### 23.1 Infrastructure Overview
- **Frontend Hosting:** Vercel edge network with continuous deployment from the GitHub repository. Single-page application route rewrites are configured via `vercel.json`.
- **Backend API Hosting:** Render Web Service running Node.js 20 LTS in production mode with environment variable management.
- **Database Hosting:** MongoDB Atlas cloud cluster with automated backups, monitoring, and IP access controls.

### 23.2 Live Production Endpoints
- **Frontend URL:** [https://skillorbit-event-booking-system.vercel.app/](https://skillorbit-event-booking-system.vercel.app/)
- **Backend API URL:** [https://skillorbit-backend.onrender.com](https://skillorbit-backend.onrender.com)
- **API Health Endpoint:** `https://skillorbit-backend.onrender.com/api/health`

---

## 24. Performance Optimization

1. **Sub-15ms Query Lookups:** Compound indexes (`{ date: 1, status: 1 }` and `{ user: 1, createdAt: -1 }`) ensure queries execute via index scans rather than collection scans.
2. **Selective Denormalization:** Snapshots of prices and attendee details inside booking records prevent expensive multi-collection joins during high-traffic lookups.
3. **Optimized Asset Bundles:** Vite code-splitting and asset tree-shaking keep total production JavaScript bundle sizes under 350 KB gzipped.
4. **Lightweight Vector Icons:** Lucide React tree-shakeable icons eliminate heavy icon fonts or external asset requests.
5. **Atomic Operations:** Direct database decrements avoid round-trip locks and transactional overhead.

---

## 25. Verification and Testing

The SkillOrbit system has been validated through an automated test suite developed with **Jest** and **Supertest**:

### 25.1 Test Suite Breakdown
| Test Category | Suite File | Scenarios Evaluated | Result |
| :--- | :--- | :--- | :--- |
| **System & Health** | `health.test.js` | API uptime, DB connectivity status, headers | 5 / 5 Passed |
| **Authentication** | `auth.test.js` | Registration, duplicate email check, bcrypt hashing, JWT issuance, profile retrieval | 14 / 14 Passed |
| **Event Management**| `events.test.js` | Catalog queries, category filters, text search, admin creation, capacity reduction guards, soft-delete | 22 / 22 Passed |
| **Booking Engine** | `bookings.test.js`| Atomic seat decrement, overselling rejection, 10-seat user cap, pass retrieval, cancellation rollback | 24 / 24 Passed |
| **Admin Analytics** | `admin.test.js` | Metric aggregations, monthly trends, user directory, CSV export format validation | 12 / 12 Passed |
| **Total** | **5 Test Suites** | **77 Automated Integration Scenarios** | **77 / 77 (100% Pass Rate)** |

---

## 26. Project Structure

```
SkillOrbit_Project/
├── README.md                                          # Master project overview & quickstart
├── ARCHITECTURE.md                                    # Architectural design specification
├── REQUIREMENTS.md                                    # Engineering requirements checklist
├── Project Report.pdf                                 # Compiled academic project report
├── Database Schema.pdf                                # Compiled database schema report
├── SkillOrbit_Event_Booking_System_Presentation.pptx  # Master submission presentation slides
├── SkillOrbit_Event_Booking_System_Presentation.pdf   # Slide deck presentation PDF
├── backend/                                           # Express.js REST API application
│   ├── src/
│   │   ├── config/                                    # Database connection setup
│   │   ├── controllers/                               # Route business logic handlers
│   │   ├── middleware/                                # Auth, role, error & watchdog middleware
│   │   ├── models/                                    # Mongoose models (User, Event, Booking)
│   │   ├── routes/                                    # REST endpoint routing definitions
│   │   ├── utils/                                     # Token generation & reference formatters
│   │   ├── app.js                                     # Express application configuration
│   │   └── server.js                                  # HTTP server listener
│   ├── tests/                                         # Jest & Supertest automated test suites
│   ├── uploads/                                       # Uploaded banner image storage
│   ├── package.json                                   # Backend dependencies & test scripts
│   └── .env.example                                   # Environment variable template
├── frontend/                                          # React 19 Single Page Application
│   ├── src/
│   │   ├── components/                                # Reusable UI components & dialogs
│   │   ├── context/                                   # Authentication state context
│   │   ├── pages/                                     # Route page views (Home, Events, Dashboard, Admin)
│   │   ├── services/                                  # API client service modules
│   │   ├── App.jsx                                    # Master router & route guard definitions
│   │   └── main.jsx                                   # React DOM root entrypoint
│   ├── public/                                        # Static assets & custom favicon
│   ├── package.json                                   # Frontend dependencies & build scripts
│   └── vite.config.js                                 # Vite bundling configuration
└── docs/                                              # Technical documentation
    ├── Project_Report.md                              # Full markdown project report
    ├── Database_Schema.md                             # Database schema documentation
    ├── API_Documentation.md                           # REST API endpoint reference
    └── database-schema.png                            # High-resolution ERD diagram
```

---

## 27. Setup and Installation

### 27.1 Prerequisites
- Node.js (v18.x or v20.x LTS)
- npm (v9.x or higher)
- MongoDB Atlas connection URI or local MongoDB daemon

### 27.2 Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create .env with:
# PORT=5000
# NODE_ENV=development
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLIENT_URL=http://localhost:5173

# Run automated test suite
npm test

# Start backend development server
npm run dev
```

### 27.3 Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env with:
# VITE_API_URL=http://localhost:5000/api

# Build for production
npm run build

# Start frontend development server
npm run dev
```

---

## 28. Limitations

1. **Email Service Integration:** Booking confirmations and digital passes are generated immediately in the browser interface; automated outbound SMTP email delivery is not included in the current build.
2. **Payment Gateway Integration:** Ticket prices and total amounts are calculated and recorded as snapshot data; external payment processor checkout flows (e.g., Stripe, Razorpay) are not connected.
3. **QR Code Scanning Hardware:** Booking reference codes are formatted for human readability (`EVT-YYYYMMDD-XXXX`); hardware barcode/QR scanning integration for turnstiles is not implemented.
4. **Single-Timezone Scheduling:** Event dates and times are stored in UTC and rendered in the user's local browser timezone without multi-timezone conversions.

---

## 29. Future Scope

1. **Outbound Transactional Email Service:** Integrate SendGrid or AWS SES to automatically dispatch PDF tickets and calendar invitations (.ics files) upon reservation.
2. **Payment Gateway Webhooks:** Integrate payment gateways (Razorpay, Stripe) with webhook validation to automate paid ticket checkouts.
3. **Mobile Ticket Wallet Integration:** Generate Apple Wallet (.pkpass) and Google Wallet passes for mobile admissions.
4. **Automated Waitlisting Engine:** Implement an automated waitlist that notifies waiting attendees when seats become available due to cancellations.
5. **Multi-Track Session Scheduling:** Expand event structures to support multi-day conferences with sub-sessions, tracks, and breakout rooms.

---

## 30. References

1. **React Documentation:** React 19 Official Documentation & Hooks Reference. [https://react.dev/](https://react.dev/)
2. **Express.js Documentation:** Routing, Middleware, and Error Handling Guide. [https://expressjs.com/](https://expressjs.com/)
3. **MongoDB Documentation:** MongoDB Manual: Atomicity, Concurrency, and Operators ($inc, $gte). [https://www.mongodb.com/docs/manual/](https://www.mongodb.com/docs/manual/)
4. **Mongoose ODM Documentation:** Schemas, Models, Indexes, and Population Reference. [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
5. **Tailwind CSS Documentation:** Utility-first CSS framework and design system. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
6. **IETF RFC 7519:** JSON Web Token (JWT) Architecture and Specification. [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519)
7. **IETF RFC 4180:** Common Format and MIME Type for Comma-Separated Values (CSV) Files. [https://datatracker.ietf.org/doc/html/rfc4180](https://datatracker.ietf.org/doc/html/rfc4180)
8. **Jest Testing Framework:** JavaScript Testing Solution. [https://jestjs.io/](https://jestjs.io/)
9. **Supertest Documentation:** High-level HTTP testing abstraction for Node.js. [https://github.com/ladjs/supertest](https://github.com/ladjs/supertest)
