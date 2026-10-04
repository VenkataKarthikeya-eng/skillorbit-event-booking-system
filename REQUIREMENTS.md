# Requirements Specification & Checklist: Event Booking System
**Web Development Capstone Project :  SkillOrbit**

---

## 1. Project Overview & Objectives
The **Event Booking System** is a responsive, full-stack web application designed to help users discover, book, and manage events online while providing administrators/organizers with an intuitive management and analytics dashboard.

### Core Objectives:
- [ ] Display upcoming and categorized events with real-time seat availability.
- [ ] Enable secure user registration, login, session management, and role-based access (User vs. Admin).
- [ ] Provide seamless ticket booking workflows with concurrency-safe seat capacity decrementing.
- [ ] Prevent invalid/negative bookings, bookings beyond available capacity, or bookings for past/inactive events.
- [ ] Deliver interactive dashboards with authentic database metrics (no hardcoded analytics).
- [ ] Generate instant booking confirmations, downloadable registration summaries, and event reports (CSV export).
- [ ] Maintain production readiness (Vite + React + Tailwind CSS on frontend; Node.js + Express + Mongoose on backend; MongoDB Atlas; Cloudinary/local fallback for media).

---

## 2. Evaluation Criteria & Deliverables Mapping

| Criteria | Weightage | Target Evidence / Verification |
| :--- | :---: | :--- |
| **Functionality** | 30% | Working auth, CRUD events, booking engine, dashboards, CSV reporting |
| **Backend & Database** | 25% | Express REST API, Mongoose schemas, relational references, safe atomic seat updates |
| **Frontend/UI** | 20% | Vite + React + Tailwind, Lucide icons, Recharts visualizations, fully responsive |
| **Booking Workflow** | 10% | Ticket selector, validation, unique reference generation, dynamic capacity check |
| **Deployment** | 10% | Environment separation (`.env.example`), Vercel (client), Render (server), Atlas |
| **Documentation** | 5% | Comprehensive Architecture, API Docs, Schema, User Guide, PPT, Demo Script |

---

## 3. Detailed Module Checklist

### Module 1: User Authentication System
- [ ] **Registration**: Name, email, secure password with strength validation, default `user` role.
- [ ] **Login & JWT**: Secure bcrypt hashing (salt rounds 10+), JWT token generation with expiration.
- [ ] **Authentication State**: Persistent state (localStorage / auth context) with axios interceptors.
- [ ] **Role-Based Access Control (RBAC)**: Protected routes (`/admin/*` for admins, `/my-bookings` for authenticated users).
- [ ] **Session Termination**: Secure logout with local token clearance.
- [ ] **Error Handling**: Graceful responses for duplicate email, incorrect credentials, expired tokens.

### Module 2: Event Management System (Admin / Organizer)
- [ ] **Event Creation**: Title, description, category, date, time, venue, address, capacity, ticket price (informational / free / standard), banner image.
- [ ] **Event Editing**: Full update capability for event schedule, venue, capacity, and details.
- [ ] **Event Deletion**: Soft/hard delete with cascading check for existing bookings.
- [ ] **Banner / Image Upload**: Support for Cloudinary upload with development fallback.
- [ ] **Seat & Status Management**: Automatic calculation of `availableSeats` based on initial capacity minus booked seats.

### Module 3: Ticket Booking System (User Facing)
- [ ] **Event Discovery**: Filter by category, search by title/venue, sort by upcoming date.
- [ ] **Event Details View**: Rich view displaying remaining seats, schedule, map/venue info, and booking form.
- [ ] **Ticket Selection**: User selects quantity (minimum 1, maximum capped per transaction and available capacity).
- [ ] **Safe Booking Transaction**: Server-side atomic validation ensuring `availableSeats >= requestedSeats`.
- [ ] **Booking Reference**: Generation of unique, human-readable booking reference (e.g., `EVT-YYYYMMDD-XXXX`).
- [ ] **Confirmation Screen**: Immediate visual confirmation with booking summary and reference.
- [ ] **Booking History**: "My Bookings" page displaying past and upcoming booked events with status.

### Module 4: Dashboard & Booking Analytics
- [ ] **User Dashboard**:
  - Upcoming booked events count & schedule.
  - Recent booking timeline.
  - Quick navigation to discover more events.
- [ ] **Admin Dashboard**:
  - Key Performance Indicators: Total Events, Total Bookings, Total Users, Total Seats Booked.
  - Recharts Visualizations:
    - Monthly / weekly booking trends.
    - Category-wise event distribution.
    - Capacity utilization rate per event.
  - Real-time recent bookings activity feed.

### Module 5: Notification & Reporting System
- [ ] **Booking Confirmation View**: Printable/viewable booking pass with QR/Reference details.
- [ ] **Admin Reporting**:
  - Event registration summary report.
  - Booking breakdown per event.
  - CSV Export capability for offline reporting and auditing.
- [ ] **Email Notifications (Optional)**: Stubbed / modular notification service ready for SMTP/Nodemailer without blocking offline development.

---

## 4. Scope Limitations & Explicit Non-Goals
As stipulated by the SkillOrbit project guidelines:
- **NO Real Payment Gateways**: No Stripe, Razorpay, or PayPal API integrations; pricing is displayed for informational simulation only.
- **NO Microservices or Kubernetes**: A clean monolithic MVC architecture (Vite frontend + Express backend).
- **NO Multi-Vendor Marketplaces**: Focused single/multi-admin management with individual attendee booking.
- **NO Complex Enterprise Cloud Infrastructure**: Standard serverless / platform-as-a-service deployment (Vercel + Render + Atlas).

---

## 5. Deliverables Tracking
- [ ] Full Source Code (Frontend & Backend)
- [ ] Project Report (`docs/project-report.md`)
- [ ] Database Schema Documentation (`docs/database-schema.md`)
- [ ] API Documentation (`docs/api-documentation.md`)
- [ ] Presentation Slide Deck Outline (`docs/presentation-slides.md`)
- [ ] Demo Video Script (`docs/demo-video-script.md`)
- [ ] Step-by-Step Installation & Deployment Guide (`README.md`)
- [ ] Final Requirements Audit (`FINAL_REQUIREMENTS_CHECKLIST.md`)
