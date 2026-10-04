# SkillOrbit: UI Screenshots & Evaluation Demonstration Guide

This guide lists the exact screenshots required for the SkillOrbit Capstone Project evaluation report, PPT presentation deck, and project submission package.

You can capture these directly from the live deployed application at [https://skillorbit-event-booking-system.vercel.app/](https://skillorbit-event-booking-system.vercel.app/) or your local environment (`http://localhost:5173`).

---

## 📸 Required Screenshot Checklist

| # | Screen / Feature | Route / Action | Key UI Elements to Capture | Purpose in Final Submission |
|---|---|---|---|---|
| 1 | **Home Landing Page** | `/` | Centered hero title, CTA buttons, quick guarantee badges, 4 capability cards, and Developer Profile card. | Showcases project identity, design elegance, and developer attribution. |
| 2 | **Event Discovery Catalog** | `/events` | Search bar with keyword query, category filter bar (`Conference`, `Workshop`, `College Fest`), and event cards. | Demonstrates real-time event filtering, search debounce, and catalog layout. |
| 3 | **Live Seat Availability Badges** | `/events` | Event cards displaying live remaining seats (e.g., `17 of 20 seats remaining`), progress bar, and `Selling Fast` or `Sold Out` badges. | Proves real-time inventory management and visual seat tracking. |
| 4 | **Event Details View** | `/events/:id` | Event banner poster, schedule timestamp, venue location, description, price, and `Book Tickets` CTA. | Shows comprehensive event details and registration entry point. |
| 5 | **Interactive Booking Modal** | Modal on `/events/:id` | Ticket quantity selector (1 to 10 seats limit), price calculation, and attendee confirmation button. | Demonstrates fair allocation limits and seamless booking UX. |
| 6 | **Digital Admission Pass** | Modal post-booking | Formatted reference code (`EVT-YYYYMMDD-XXXX`), attendee name, event date, venue, QR stub simulation, and print button. | Proves instant digital ticket issuance with printable styling. |
| 7 | **Attendee Dashboard** | `/dashboard` | Total Bookings counter, Active Passes metric, Cancelled Tickets count, upcoming schedule list, and event recommendations. | Demonstrates personalized attendee portal and schedule overview. |
| 8 | **My Bookings & Cancellation** | `/my-bookings` | Personal booking history table, status badges (`confirmed`, `cancelled`), View Pass button, and Cancel Booking action. | Proves self-service booking management and atomic seat restitution. |
| 9 | **Admin Dashboard & Analytics** | `/admin/dashboard` | KPI summary cards (Total Events, Bookings, Capacity %, Users), Recharts AreaChart (Monthly Trends), and Donut Chart (Category Breakdown). | Demonstrates real-time executive business intelligence and visual telemetry. |
| 10 | **CSV Report Downloads** | `/admin/dashboard` | One-click `Download Bookings CSV` and `Download Events CSV` buttons, plus open CSV spreadsheet in Excel/Sheets. | Proves RFC 4180 data portability and physical venue gate check-in roster generation. |
| 11 | **Event Management Console** | `/admin/events` | Table of all events with status pills (`published`, `draft`, `cancelled`), Edit button, and Safe Deletion/Archive action. | Demonstrates organizer CRUD controls and audit trail preservation. |
| 12 | **Automated Test Results** | Terminal (`backend/`) | Terminal execution of `npm test` displaying `77 PASSED, 0 FAILED (100% OF END-TO-END TEST CASES PASSED)`. | Proves complete automated verification and 100% test coverage. |

---

## 🔑 Demo Credentials for Capturing Screenshots

- **Administrator Console:**
  - Email: `admin@skillorbit.com`
  - Password: `AdminPassword123!`
  - *(Accesses Admin Dashboard, Recharts Analytics, Event Management, and CSV Reports)*

- **Student Attendee Account:**
  - Email: `student@skillorbit.com`
  - Password: `StudentPassword123!`
  - *(Accesses Event Booking, Digital Admission Passes, Attendee Dashboard, and My Bookings)*
