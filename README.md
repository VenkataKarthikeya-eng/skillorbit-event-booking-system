SkillOrbit: Event Booking System
Web Development Capstone Project
A full-stack, responsive web application for live event discovery, atomic seat reservation, administrative event management, real-time analytics, and automated reporting.

Node.js React Vite Tailwind CSS MongoDB Atlas License: ISC Test Suite

🌐 Live Deployment & Project Links
Live Website: https://skillorbit-event-booking-system.vercel.app/
Backend API: https://skillorbit-backend.onrender.com
API Health Check: https://skillorbit-backend.onrender.com/api/health
GitHub Repository: https://github.com/VenkataKarthikeya-eng/skillorbit-event-booking-system
Lead Developer & Designer: Cherukuri Venkata Karthikeya
📋 Table of Contents
Overview
Key Features
Capstone Submission Deliverables
Architecture & Tech Stack
Directory Structure
Prerequisites
Environment Configuration
Local Setup & Installation
Database Seeding
Running the Applications
Running Automated Tests
Default Demo Credentials
REST API Reference
Production Deployment Guide
Security & Concurrency Guarantees
Author & Lead Developer
🌟 Overview
The SkillOrbit Event Booking System is an enterprise-grade academic capstone project designed to replicate the end-to-end operational requirements of modern event ticketing platforms (such as Eventbrite and BookMyShow). It supports role-based access control (Attendees & Administrators), real-time seat decrementing under concurrent loads, live business intelligence dashboards with charts, and CSV report generation.

🚀 Key Features
1. User & Authentication Module
JWT-Based Authentication: Stateless session management via HTTP Bearer tokens.
Password Hashing: Salted passwords encrypted via bcryptjs (cost factor 10).
Role-Based Authorization: Granular authorization middleware protecting routes (user vs admin).
Session Persistence: LocalStorage token caching with automated request/response Axios interceptors.
2. Event Management Module (Admin)
Full CRUD Operations: Create, preview, edit, publish, and delete events.
Smart Lifecycle Status: Transition between published, draft, and cancelled.
Safe Deletion / Audit Trail: Prevents deletion of events with existing confirmed bookings by automatically archiving/cancelling them instead of hard deleting historical records.
Media Handling: Dual-mode banner support (image file uploads via Multer and remote image URLs).
3. Concurrency-Safe Ticket Booking Module
Atomic Seat Decrements: Uses atomic MongoDB $inc operations with $gte queries to prevent double-booking and negative capacity under high concurrency.
Seat Allocation Bounds: Strict reservation limit of 10 tickets per attendee per event.
Unique Reference Generation: Generates human-readable, collision-resistant references (EVT-YYYYMMDD-XXXX).
Digital Ticket Pass: Modal pass complete with attendee information, QR stub simulation, copyable code, and printer stylesheet.
Self-Service Cancellation: Attendees can cancel reservations with atomic rollback of seats back to the event pool.
4. Dashboards & Visual Analytics
Attendee Dashboard (/dashboard): Real-time booking count, active admission passes, upcoming schedules, and event discovery recommendations.
Admin Dashboard (/admin/dashboard): Metrics on Total Events, Bookings, Capacity Utilization, Registered Users, and Simulated Revenue.
Interactive Charts (Recharts):
Area chart for 6-month reservation trends.
Donut / Pie chart for event category breakdown.
CSV Reporting Engine: Instant server-side generation of flattened CSV files for both Bookings and Event Occupancy summaries.
5. UI Polish & Accessibility
Context-Driven Toast Notifications: Non-intrusive notifications for login, registration, booking, cancellation, and report downloads.
Fully Responsive: Tested across mobile (<640px), tablet (768px), and desktop (1024px+) viewports.
Accessibility: Full keyboard Escape closing for all modals, ARIA dialog attributes, and readable color contrast.
📑 Capstone Submission Deliverables
The repository includes complete academic submission documentation, schemas, slides, and reports:

Deliverable	Format	File Location	Description
Project Report (PDF)	PDF	Project Report.pdf	Complete 30-section academic capstone report (9 pages)
Project Report (Markdown)	Markdown	docs/Project_Report.md	Full text project report containing all 30 numbered sections
Database Schema (PDF)	PDF	Database Schema.pdf	Formal database schema specification & indexing report
Database Schema (Markdown)	Markdown	docs/Database_Schema.md	Data dictionary, Mongoose schema models, integrity rules
Database ERD Diagram	Image (PNG)	docs/database-schema.png	High-resolution 300 DPI Entity Relationship Diagram
REST API Documentation	Markdown	docs/API_Documentation.md	Complete specifications for all 18 authentic endpoints
Presentation Deck (PPTX)	PowerPoint	SkillOrbit_Event_Booking_System_Presentation.pptx	Final executive slide deck matching presentation template
Presentation Deck (PDF)	PDF	SkillOrbit_Event_Booking_System_Presentation.pdf	Slide deck exported to vector PDF
Architecture Specification	Markdown	ARCHITECTURE.md	High-level architectural design and data flow breakdown
Requirements Specification	Markdown	REQUIREMENTS.md	Functional and non-functional requirements checklist
🛠 Architecture & Tech Stack
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│               React 19 + Vite + Tailwind CSS                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Node / Express API                     │
│    Auth Middleware ──► Controllers ──► Validation & Errors  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas Cloud                     │
│             Collections: users, events, bookings            │
└─────────────────────────────────────────────────────────────┘
Layer	Technologies
Frontend	React 19, Vite 8, Tailwind CSS 3.4, React Router 7, Axios, Lucide React, Recharts
Backend	Node.js, Express 4.21, Mongoose 8.9, JWT, bcryptjs, Multer, json2csv, CORS, Dotenv
Database	MongoDB Atlas (Cloud Cluster M0 / Serverless)
Testing	Node.js Test Runner with custom automated E2E assertion suite (77 tests)
📂 Directory Structure
SkillOrbit_Project/
├── README.md                                          # Master project overview & documentation
├── ARCHITECTURE.md                                    # Architectural design specification
├── REQUIREMENTS.md                                    # Engineering requirements specification
├── Project Report.pdf                                 # Compiled academic project report (30 sections)
├── Database Schema.pdf                                # Compiled database schema report & ERD
├── SkillOrbit_Event_Booking_System_Presentation.pptx  # Submission presentation slide deck
├── SkillOrbit_Event_Booking_System_Presentation.pdf   # Slide deck exported as vector PDF
├── backend/                                           # Express.js REST API service
│   ├── src/
│   │   ├── config/                                    # MongoDB Atlas connection & configuration
│   │   ├── controllers/                               # Route business logic handlers
│   │   ├── middleware/                                # Auth, role authorization, db watchdog & error handling
│   │   ├── models/                                    # Mongoose Schemas (User, Event, Booking)
│   │   ├── routes/                                    # Express REST endpoint routing
│   │   ├── utils/                                     # Reference generator, JWT helper, seed script
│   │   ├── app.js                                     # Express app setup, CORS, and route mounting
│   │   └── server.js                                  # HTTP server entrypoint
│   ├── tests/                                         # Automated Jest & Supertest suites (77 tests)
│   ├── uploads/                                       # Uploaded event banner storage
│   ├── .env.example                                   # Environment variable template
│   └── package.json                                   # Backend dependencies & scripts
├── frontend/                                          # React 19 Single Page Application
│   ├── public/                                        # Static assets, custom favicon
│   ├── src/
│   │   ├── components/                                # Common, booking modals, event cards & filters
│   │   ├── context/                                   # AuthContext & ToastContext providers
│   │   ├── hooks/                                     # Custom React hooks (useAuth, useToast)
│   │   ├── layouts/                                   # Main responsive application layout
│   │   ├── pages/                                     # Public, user, and admin views
│   │   ├── routes/                                    # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/                                  # Centralized Axios API clients
│   │   ├── App.jsx                                    # Root component with providers
│   │   └── main.jsx                                   # Vite entry point
│   ├── vercel.json                                    # Vercel SPA routing configuration
│   ├── .env.example                                   # Frontend API base URL template
│   └── package.json                                   # Frontend dependencies & scripts
├── docs/                                              # Comprehensive project documentation
│   ├── Project_Report.md                              # Full markdown project report (30 sections)
│   ├── Database_Schema.md                             # Database schema & indexing specification
│   ├── API_Documentation.md                           # REST API reference covering all 18 endpoints
│   └── database-schema.png                            # High-resolution ERD diagram (300 DPI)
└── .gitignore                                         # Multi-layer git exclusion rules
⚙️ Prerequisites
Node.js: v18.0.0 or higher
npm: v9.0.0 or higher
MongoDB: A free MongoDB Atlas cluster URI (or local MongoDB v6+)
🔐 Environment Configuration
Backend Configuration (backend/.env)
Copy backend/.env.example to backend/.env:

cp backend/.env.example backend/.env
Set the following variables:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/event_booking_db?retryWrites=true&w=majority
JWT_SECRET=skillorbit_secure_jwt_secret_capstone_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
Security Note: Never commit backend/.env to source control. It is strictly excluded by .gitignore.

Frontend Configuration (frontend/.env)
Copy frontend/.env.example to frontend/.env:

cp frontend/.env.example frontend/.env
Configure the backend API URL:

VITE_API_URL=http://localhost:5000/api
📦 Local Setup & Installation
1. Install Backend Dependencies
cd backend
npm install
2. Install Frontend Dependencies
cd ../frontend
npm install
🗄 Database Seeding
To initialize the database with standard administrator accounts, student attendee accounts, scheduled events across diverse categories, and initial bookings, run:

cd backend
npm run seed
Output:

📦 Connecting to MongoDB Atlas...
✅ MongoDB Atlas Connected!
🧹 Clearing existing records...
👥 Creating demo users...
📅 Creating realistic events...
🎟️ Creating initial bookings...
✨ Database seeding completed successfully!
🏃 Running the Applications
1. Start the Backend Server
cd backend
npm run dev
# Or for production:
npm start
The backend will be live at http://localhost:5000.
Verify health status at http://localhost:5000/api/health.

2. Start the Frontend Application
cd frontend
npm run dev
The frontend will be live at http://localhost:5173.

🧪 Running Automated Tests
The project includes an end-to-end integration test runner validating 77 test cases covering the entire application lifecycle, role gates, concurrency bounds, and error fallbacks:

cd backend
npm test
Expected result:

================================================================
       SKILLORBIT END-TO-END AUTOMATED TEST SUITE               
================================================================
...
================================================================
  COMPREHENSIVE TEST RESULTS: 77 PASSED, 0 FAILED
  🎯 100% OF END-TO-END TEST CASES PASSED WITH ZERO FAILURES!
================================================================
🔑 Default Demo Credentials
For quick evaluation and grading, the seed script provisions two demo accounts:

Role	Email	Password	Access Privileges
Administrator	admin@skillorbit.com	AdminPassword123!	Admin Dashboard, Event CRUD, CSV Exports, User List
Student / Attendee	student@skillorbit.com	StudentPassword123!	Event Browsing, Ticket Booking, My Bookings, Dashboard
(Convenient one-click "Fill Admin Demo" and "Fill Student Demo" buttons are also provided on the /login screen).

📡 REST API Reference
Health
GET /api/health: System status, uptime, and database connection state
Authentication (/api/auth)
POST /api/auth/register: Register a new attendee account
POST /api/auth/login: Authenticate and receive JWT token
GET /api/auth/me: Retrieve currently authenticated user profile
Events (/api/events)
GET /api/events: Browse published events (supports ?category= and ?search=)
GET /api/events/:id: Get complete event details by ID
GET /api/events/admin/all: (Admin) Get all events including drafts and cancelled
POST /api/events: (Admin) Create a new scheduled event
PUT /api/events/:id: (Admin) Update event details or adjust capacity
DELETE /api/events/:id: (Admin) Delete or safely archive an event
Bookings (/api/bookings)
POST /api/bookings: (Protected) Reserve tickets (concurrency-safe atomic decrement)
GET /api/bookings/my: (Protected) Retrieve personal booking history
GET /api/bookings/user/dashboard: (Protected) Retrieve attendee KPI metrics & upcoming passes
GET /api/bookings/:id: (Protected) View booking pass by MongoDB ID or Reference code
PUT /api/bookings/:id/cancel: (Protected) Cancel booking and release seats back to the event
Administrative Operations (/api/admin)
GET /api/admin/dashboard: (Admin) Live metrics, monthly booking trends, category distribution
GET /api/admin/bookings: (Admin) Retrieve all bookings across the platform
GET /api/admin/users: (Admin) Retrieve registered user accounts
Reports (/api/reports)
GET /api/reports/bookings/csv: (Admin) Export all booking transactions as CSV
GET /api/reports/events/csv: (Admin) Export event occupancy & capacity summary as CSV
Media Upload (/api/upload)
POST /api/upload: (Admin) Upload event banner image (multipart/form-data)
Comprehensive API Reference: For complete request bodies, query parameters, authorization headers, and JSON error response schemas for all 18 authentic endpoints, see docs/API_Documentation.md.

🚢 Production Deployment Guide
Option 1: Deploy Frontend on Vercel
Connect your repository to Vercel.
Set the Root Directory to frontend.
Set the Build Command to npm run build and Output Directory to dist.
Add the environment variable:
VITE_API_URL = https://your-backend-api-url.onrender.com/api
Deploy. The included frontend/vercel.json automatically handles SPA rewrites so direct navigation and refreshes work seamlessly.
Option 2: Deploy Backend on Render
Create a New Web Service connected to your repository on Render.
Set the Root Directory to backend.
Set Build Command to npm install.
Set Start Command to node src/server.js.
Configure Environment Variables in the Render dashboard:
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://...
JWT_SECRET = <your-production-secret>
CLIENT_URL = https://your-frontend.vercel.app
Deploy. Render will provision HTTPS automatically.
Option 3: Custom Domain Connection
To launch under your own branded apex domain or subdomain (e.g. skillorbit.yourdomain.com):

Frontend Custom Domain (Vercel):
In Vercel, navigate to Settings > Domains.
Add your custom domain (e.g. events.yourdomain.com or yourdomain.com).
In your DNS registrar (GoDaddy, Cloudflare, Namecheap, etc.), add the recommended DNS records:
For apex domain: A record pointing to 76.76.21.21
For subdomain: CNAME record pointing to cname.vercel-dns.com
Vercel provisions an automated SSL/TLS certificate within minutes.
Backend API Custom Domain (Render):
In Render, navigate to your backend web service Settings > Custom Domains.
Add your API subdomain (e.g. api.yourdomain.com).
Add a CNAME record in DNS pointing to your Render service address (<service-name>.onrender.com).
Environment Sync:
Update Render backend CLIENT_URL to https://events.yourdomain.com.
Update Vercel frontend VITE_API_URL to https://api.yourdomain.com/api.
Trigger a rebuild to activate full production routing.
🛡 Security & Concurrency Guarantees
No Race Conditions: Seat decrementing is handled via Mongoose atomic operations:
await Event.findOneAndUpdate(
  { _id: eventId, status: 'published', availableSeats: { $gte: requestedSeats } },
  { $inc: { availableSeats: -requestedSeats } },
  { new: true }
);
If remaining capacity is less than the requested seats at execution time, the operation fails without deducting tickets.
Credential Sanitization: User passwords use selective exclusion (select: false) on queries and are never logged or returned in responses.
Data Integrity: Historical booking references cannot be modified. Cancellation triggers atomic capacity restoration.
Zero Exposed Secrets: .env is omitted from all git stages and verified by automated pre-commit audits.
👨‍💻 Author & Lead Developer
Developer & UI/UX Designer: Cherukuri Venkata Karthikeya
Live Deployment: https://skillorbit-event-booking-system.vercel.app/
GitHub Repository: https://github.com/VenkataKarthikeya-eng/skillorbit-event-booking-system
📄 License
This project is licensed under the ISC License as part of the SkillOrbit Web Development Capstone Evaluation.
