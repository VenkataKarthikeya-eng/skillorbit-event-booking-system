# Capstone Project Video Demonstration Script
**SkillOrbit Web Development Capstone Project — Event Booking System**
**Target Duration:** ~8 to 9 minutes  
**Format:** Screen Recording + Voiceover Narration  

---

## Video Production Guidelines for Presenter
- **Resolution:** 1080p (1920x1080) at 30 or 60 fps.
- **Audio:** Clear microphone audio without background noise.
- **Preparation Before Recording:**
  1. Have MongoDB Atlas connected via `backend/.env`.
  2. Seed the database freshly with `npm run seed` in the `backend/` directory.
  3. Start the backend with `npm start` (port 5000).
  4. Start the frontend with `npm run dev` (port 5173).
  5. Open Google Chrome in full screen at `http://localhost:5173`.
  6. Prepare two browser tabs or an incognito window: one for **Student** (`student@skillorbit.com`) and one for **Admin** (`admin@skillorbit.com`).

---

## Timed Video Demonstration Script

### Scene 1: Introduction & Project Overview
- **Timecode:** `0:00 - 0:30` (30 seconds)
- **Screen Action:**
  - Browser displays the SkillOrbit Home Page (`http://localhost:5173`).
  - Smoothly scroll down through the Hero Banner, features highlights, and upcoming event cards.
- **Narrator Voiceover:**
  > "Hello everyone, and welcome to the project demonstration of the **SkillOrbit Event Booking and Management System**—our full-stack web development capstone project.
  > 
  > SkillOrbit is a modern, enterprise-grade web application engineered on the MERN stack—MongoDB Atlas, Express, React 19, and Node.js. It solves critical challenges in campus and corporate event registration: eliminating seat overselling through concurrency-safe atomic operations, providing digital ticket passes, and giving organizers real-time visual analytics and CSV reports. Let's dive in!"

---

### Scene 2: Authentication & Role-Based Navigation
- **Timecode:** `0:30 - 1:15` (45 seconds)
- **Screen Action:**
  - Click **Sign In** in the navbar.
  - Show the clean login form.
  - Enter student credentials: `student@skillorbit.com` / `StudentPassword123!`.
  - Click **Sign In**.
  - Highlight the green toast notification: *"Logged in successfully"*.
  - Show how the navbar dynamically updates: the "Sign In" / "Register" buttons are replaced with user avatar, name, "My Bookings", and "Dashboard" links.
- **Narrator Voiceover:**
  > "We'll begin by looking at authentication and Role-Based Access Control. 
  > 
  > The platform implements secure, stateless JSON Web Token authentication with passwords hashed using bcrypt. When I sign in as our student account, our React frontend stores the JWT in local storage, and our custom Axios interceptor automatically attaches it as a Bearer token to all future requests.
  > 
  > Notice the dynamic navbar: authenticated attendees immediately gain access to their personal Dashboard and Bookings history, while administrative panels remain strictly hidden."

---

### Scene 3: Public Event Browsing, Search & Filtering
- **Timecode:** `1:15 - 2:00` (45 seconds)
- **Screen Action:**
  - Click **Explore Events** in the navbar to navigate to `/events`.
  - Click different category filter pills: **All**, **Workshop**, **Conference**, **Concert**.
  - Type `"Cloud"` or `"Architecture"` into the search box; observe instant real-time card filtering.
  - Clear the search box to restore the full event list.
- **Narrator Voiceover:**
  > "Now, let's explore the Event Discovery catalog. 
  > 
  > Attendees can browse all published events. The catalog provides an intuitive category filter bar—allowing users to filter by Workshops, Conferences, Concerts, or College Fests with zero page reloads.
  > 
  > We can also perform instant keyword search. As I type 'Cloud', the interface dynamically filters matching titles, descriptions, and venues. Notice each event card displays essential details: date, time, venue, ticket price, and a real-time badge indicating available seats."

---

### Scene 4: Event Details & Seat Availability
- **Timecode:** `2:00 - 2:45` (45 seconds)
- **Screen Action:**
  - Click **View Details** on an upcoming event card (e.g., *Full-Stack Cloud Architecture Summit*).
  - Show the event details hero image, full description, event date/time chips, venue location, and organizer credit.
  - Point the mouse at the **Seat Availability Meter** showing remaining seats out of total capacity.
- **Narrator Voiceover:**
  > "Clicking on an event brings us to the comprehensive Event Details view. 
  > 
  > Here, attendees can review the full schedule, location details, and organizer information. Most importantly, look at the Seat Availability indicator. This displays the live inventory pulled directly from MongoDB Atlas. If an event sells out, the booking button automatically disables and displays a prominent 'Sold Out' badge, preventing invalid booking attempts."

---

### Scene 5: Ticket Booking & Concurrency-Safe Reservation
- **Timecode:** `2:45 - 3:30` (45 seconds)
- **Screen Action:**
  - Click the **Book Tickets Now** button.
  - The `BookingModal` appears.
  - Use the quantity increment buttons to change seats from `1` to `3`.
  - Point out how the total calculated amount updates instantly.
  - Fill in attendee details or keep defaults.
  - Click **Confirm Booking**.
- **Narrator Voiceover:**
  > "Let's book tickets for this event. Clicking 'Book Tickets Now' opens our interactive reservation modal. 
  > 
  > I can select ticket quantities between 1 and 10 seats. As I adjust the counter, the total amount recalculates in real time. 
  > 
  > When I click 'Confirm Booking', our backend executes an atomic `findOneAndUpdate` with a `$gte` guard condition on MongoDB Atlas. This guarantees that seats are decremented only if enough inventory exists at that exact millisecond. If multiple users book the last available seats simultaneously, race conditions are completely prevented—zero overselling is guaranteed."

---

### Scene 6: Booking Confirmation & Digital Ticket Pass
- **Timecode:** `3:30 - 4:15` (45 seconds)
- **Screen Action:**
  - The booking modal transitions into the `BookingConfirmationModal` (Digital Boarding Pass).
  - Point out the unique reference code (e.g., `EVT-20261001-XXXXXX`).
  - Point out the attendee name, event details, venue, and simulated barcode.
  - Click **Print / Save Pass**; show the browser print dialog preview, then close it.
  - Click **View My Bookings**.
- **Narrator Voiceover:**
  > "Upon successful confirmation, the system instantly generates an official digital ticket pass! 
  > 
  > Notice the unique, human-readable reference code formatted as EVT-YYYYMMDD followed by a hex identifier. The pass displays attendee credentials, venue details, and an event boarding pass layout. 
  > 
  > Attendees can click 'Print / Save Pass' to trigger a clean printable view or save it as a PDF for offline campus check-in. Now let's head over to My Bookings."

---

### Scene 7: Attendee Dashboard & My Bookings
- **Timecode:** `4:15 - 5:00` (45 seconds)
- **Screen Action:**
  - Show the **My Bookings** page (`/my-bookings`).
  - Point out the newly created confirmed booking card.
  - Click the copy button next to the reference code; show the toast notification *"Reference copied to clipboard!"*.
  - Navigate to **Dashboard** (`/dashboard`).
  - Highlight the 4 metric cards: Active Passes, Total Tickets, Total Reservations, Cancelled.
  - Show the **Upcoming Bookings** section and the **Discover Events** carousel.
- **Narrator Voiceover:**
  > "Under 'My Bookings', attendees have a full historical ledger of all past and upcoming reservations. They can copy their reference code in one click or view the full ticket pass anytime.
  > 
  > Moving to the attendee **Dashboard**, users get a personalized snapshot: active passes, total tickets booked, and cancelled reservations. The dashboard also features an intelligent discovery widget, showcasing upcoming events the student has not yet reserved."

---

### Scene 8: Booking Cancellation & Automatic Seat Rollback
- **Timecode:** `5:00 - 5:45` (45 seconds)
- **Screen Action:**
  - Return to **My Bookings**.
  - Click **Cancel Booking** on the newly created reservation.
  - A confirmation dialog appears asking: *"Are you sure you want to cancel this booking?"*.
  - Click **Yes, Cancel Reservation**.
  - Show the green toast: *"Booking cancelled successfully and reserved seats released back to event"*.
  - Notice the booking card badge immediately turns to a red *"Cancelled"* pill.
  - Navigate back to the event details page; show that the available seat count has increased back by the exact number of cancelled tickets!
- **Narrator Voiceover:**
  > "SkillOrbit also empowers attendees with self-service booking cancellations. 
  > 
  > When an attendee cancels a reservation, our backend marks the booking as cancelled and executes an atomic `$inc` operation on the event document in MongoDB. 
  > 
  > As you can see, the booking status immediately updates to 'Cancelled', and when we revisit the event page, the available seats have been automatically restored to the inventory pool. Zero manual administrative intervention is required!"

---

### Scene 9: Admin Dashboard & Real-Time Analytics
- **Timecode:** `5:45 - 6:30` (45 seconds)
- **Screen Action:**
  - Log out of the student account.
  - Sign in with Admin credentials: `admin@skillorbit.com` / `AdminPassword123!`.
  - Navigate to `/admin/dashboard`.
  - Highlight the KPI metric cards: Total Events, Total Users, Confirmed Bookings, Platform Revenue, and Overall Occupancy rate.
  - Hover over the **Monthly Booking Trends Area Chart**; show the interactive Recharts tooltips.
  - Hover over the **Category Distribution Donut Chart**; show the category percentages.
- **Narrator Voiceover:**
  > "Now, let's explore the platform from the perspective of an event organizer. I am logging in as our administrator.
  > 
  > Notice the Admin Dashboard. At the top, we have real-time KPI metrics aggregated directly from MongoDB: total events, registered attendees, confirmed bookings, and overall venue occupancy.
  > 
  > Below the KPIs, we have integrated interactive Recharts data visualizations. Here is an Area Chart tracking 6-month booking trends, and a Donut Chart displaying the distribution of events across categories like Workshops, Conferences, and Tech Talks. All charts feature hover tooltips and handle dynamic dataset scaling effortlessly."

---

### Scene 10: Admin Event CRUD & Dual-Mode Poster Upload
- **Timecode:** `6:30 - 7:30` (60 seconds)
- **Screen Action:**
  - Click **Manage Events** in the admin menu.
  - Click **Create New Event** (`/admin/events/new`).
  - Fill in event fields:
    - Title: `"AI & Robotics Symposium 2026"`
    - Category: `"Tech Talk"`
    - Date: Select future date
    - Time: `"10:00 AM - 03:00 PM"`
    - Venue: `"Robotics Innovation Lab 101"`
    - Capacity: `50`
    - Price: `150`
  - Demonstrate the banner selection: upload a sample image file or select a high-resolution Unsplash URL.
  - Click **Create Event**.
  - Show the success toast and show the newly created event appearing in the inventory list.
  - Click **Edit** on an existing event, adjust capacity, and save.
- **Narrator Voiceover:**
  > "Administrators have complete lifecycle control over events. Let's create a new event.
  > 
  > The event creation form provides comprehensive validation. Organizers can configure titles, agendas, categories, capacities, and pricing. 
  > 
  > For event promotional banners, the system supports dual modes: administrators can upload local images via our secure Multer pipeline or supply high-resolution web poster URLs. 
  > 
  > Once submitted, the event is immediately live. When editing capacity on an existing event, our backend enforces data integrity: an admin cannot reduce capacity below the number of seats already reserved by attendees."

---

### Scene 11: CSV Reports Export & Audit Trail Protection
- **Timecode:** `7:30 - 8:15` (45 seconds)
- **Screen Action:**
  - Return to `/admin/dashboard`.
  - Click **Download Bookings CSV**. Show browser file download: `bookings-report-2026-10-01.csv`.
  - Click **Download Events CSV**. Show browser file download: `events-summary-2026-10-01.csv`.
  - Briefly open or preview the CSV file showing clean columns (`BookingReference`, `AttendeeName`, `TotalAmount`, `OccupancyPercent`).
  - Return to Manage Events and attempt to delete an event that has active bookings; show the system notification: *"Event has active bookings. Status set to cancelled to protect historical data."*
- **Narrator Voiceover:**
  > "For administrative reporting, SkillOrbit provides one-click CSV export pipelines.
  > 
  > By clicking 'Download Bookings CSV', the backend streams an RFC-compliant spreadsheet of all attendee registrations, perfect for entrance gate verification. The 'Download Events CSV' generates an occupancy audit summarizing capacity utilization percentages across all events.
  > 
  > Furthermore, look at our audit trail protection: if an administrator attempts to delete an event that already has confirmed attendee bookings, the system automatically transitions the event to 'cancelled' status rather than hard-deleting it, ensuring zero data loss and preserving financial audit integrity."

---

### Scene 12: Technical Architecture & Automated Testing
- **Timecode:** `8:15 - 8:45` (30 seconds)
- **Screen Action:**
  - Switch briefly to the terminal / command prompt.
  - Run or highlight the completed output of `npm test`:
    - Display the summary banner: `COMPREHENSIVE TEST RESULTS: 77 PASSED, 0 FAILED (100%)`.
  - Highlight the production build passing with 0 warnings.
- **Narrator Voiceover:**
  > "Behind this seamless UI is rigorous software engineering. 
  > 
  > We have verified every API endpoint, role permission, and concurrency boundary with an automated end-to-end integration test suite. As you can see on the terminal, exactly 77 comprehensive test scenarios were executed directly against our live MongoDB Atlas cluster, achieving a flawless 100% pass rate with zero failures. Our production frontend builds in under one second with zero compilation errors."

---

### Scene 13: Conclusion & Wrap-Up
- **Timecode:** `8:45 - 9:00` (15 seconds)
- **Screen Action:**
  - Switch back to the clean SkillOrbit home page.
  - Display contact/evaluation credentials on screen:
    - Admin: `admin@skillorbit.com`
    - Student: `student@skillorbit.com`
- **Narrator Voiceover:**
  > "In conclusion, the SkillOrbit Event Booking System successfully delivers an intuitive, secure, and concurrency-safe platform ready for real-world deployment. Thank you for watching, and we welcome your questions!"

---

## Post-Recording Checklist
- [ ] Verify video audio levels and ensure no ambient microphone noise.
- [ ] Verify video playback is clear at 1080p resolution.
- [ ] Confirm all 13 scenes are covered within the 8 to 9-minute window.
- [ ] Save the recording as an MP4 file named `SkillOrbit_Demo_Video.mp4`.
- [ ] Upload the video file to your submission Google Drive folder with view permissions enabled.
