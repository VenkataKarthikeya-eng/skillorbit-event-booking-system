# REST API Specification & Endpoint Documentation
**SkillOrbit Web Development Capstone Project :  Event Booking System**

---

## 1. Overview & Protocol Specification

The SkillOrbit Event Booking System provides a fully RESTful HTTP API following standard JSON payload conventions, standard HTTP status codes, and stateless JWT token authentication.

- **Base URL (Local Development):** `http://localhost:5000/api`
- **Default Content Type:** `application/json` (except file uploads which use `multipart/form-data` and CSV exports which return `text/csv`)
- **Authentication Scheme:** `Bearer <token>` passed via HTTP `Authorization` request header.

### Standard Response Envelope
All API endpoints return structured JSON with consistent root fields:
```json
// Success Response
{
  "success": true,
  "message": "Human readable action outcome (optional)",
  "data": { ... } // Or named entities (event, booking, user, etc.)
}

// Error Response
{
  "success": false,
  "message": "Specific explanation of the error condition",
  "errors": [ ... ] // Optional array of validation errors
}
```

### Standard HTTP Status Codes
| Status Code | Semantics | Typical Occurrence |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Successful GET, PUT, or DELETE request |
| `201 Created` | Resource created | Successful entity creation (register, new event, new booking) |
| `400 Bad Request` | Client validation failure | Missing fields, capacity exceeded, invalid dates, malformed input |
| `401 Unauthorized` | Authentication required | Missing, expired, or invalid JWT Bearer token |
| `403 Forbidden` | Access denied | Non-admin accessing admin resources or attendee accessing another user's booking |
| `404 Not Found` | Resource not found | Invalid event ID, booking reference, or endpoint URL |
| `500 Server Error` | Unhandled internal exception | Server-side runtime errors |

---

## 2. System Health & Diagnostics

### `GET /api/health`
Verifies server liveness, operational status, and real-time MongoDB Atlas connectivity.
- **Access:** Public
- **Headers:** None required
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Event Booking System API is operational",
  "timestamp": "2026-10-01T14:10:00.000Z",
  "database": "connected",
  "environment": "development",
  "version": "1.0.0"
}
```
- **Error Response (`503 Service Unavailable`):**
```json
{
  "success": false,
  "message": "Service degraded",
  "database": "disconnected"
}
```

---

## 3. Authentication & User Profile (`/api/auth`)

### 3.1 Register New Account
`POST /api/auth/register`
Creates a new attendee account and returns an authenticated JWT. (Role is hard-locked to `'user'`).

- **Access:** Public
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+91 9876543210"
}
```
- **Validation Rules:**
  - `name`: Required, 2-60 characters.
  - `email`: Required, valid email format, unique across database.
  - `password`: Required, minimum 6 characters.
  - `phone`: Optional string.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGNjMDA...",
  "user": {
    "_id": "674cc0010000000000000001",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user",
    "phone": "+91 9876543210",
    "createdAt": "2026-10-01T14:15:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{"success": false, "message": "An account with this email address already exists"}`
  - `400 Bad Request`: `{"success": false, "message": "Password must be at least 6 characters long"}`

---

### 3.2 User Login
`POST /api/auth/login`
Authenticates credentials against bcrypt hash and issues a signed JWT token valid for 7 days.

- **Access:** Public
- **Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGNjMDA...",
  "user": {
    "_id": "674cc0010000000000000001",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user",
    "phone": "+91 9876543210"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{"success": false, "message": "Please provide both email and password"}`
  - `401 Unauthorized`: `{"success": false, "message": "Invalid email or password"}`

---

### 3.3 Get Authenticated Profile
`GET /api/auth/me`
Retrieves current user profile decoded from the active JWT token.

- **Access:** Private (`Bearer <token>`)
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "_id": "674cc0010000000000000001",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user",
    "phone": "+91 9876543210"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: `{"success": false, "message": "Not authorized to access this route"}`

---

## 4. Event Management (`/api/events`)

### 4.1 Browse Published Events
`GET /api/events`
Returns all public events in `published` status matching optional query filters.

- **Access:** Public
- **Query Parameters:**
  - `category` (optional): Filter by exact category (e.g., `Workshop`, `Conference`, `Concert`).
  - `search` (optional): Case-insensitive keyword search across `title`, `description`, `venue`, and `location`.
  - `upcoming` (optional, boolean): If `true`, returns only events with `date >= current_timestamp`.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "events": [
    {
      "_id": "674cc0020000000000000002",
      "title": "Full-Stack Cloud Architecture Summit",
      "description": "Comprehensive one-day summit exploring modern cloud microservices...",
      "category": "Conference",
      "date": "2026-11-15T09:00:00.000Z",
      "time": "09:30 AM - 05:00 PM",
      "venue": "APJ Abdul Kalam Auditorium",
      "location": "Main Campus, Hyderabad",
      "bannerUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      "capacity": 250,
      "availableSeats": 242,
      "ticketPrice": 199,
      "status": "published",
      "organizer": {
        "_id": "674cc0000000000000000000",
        "name": "System Administrator",
        "email": "admin@skillorbit.com"
      }
    }
  ]
}
```

---

### 4.2 Get Admin Event Inventory
`GET /api/events/admin/all`
Returns all system events regardless of lifecycle status (`published`, `draft`, `cancelled`).

- **Access:** Admin only (`Bearer <admin_token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 5,
  "events": [ ... ]
}
```

---

### 4.3 Get Single Event Details
`GET /api/events/:id`
Retrieves comprehensive details for a specific event by MongoDB ObjectId.

- **Access:** Public
- **URL Parameters:** `id` (24-character hex MongoDB ObjectId)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "event": {
    "_id": "674cc0020000000000000002",
    "title": "Full-Stack Cloud Architecture Summit",
    "description": "Comprehensive one-day summit exploring modern cloud microservices...",
    "category": "Conference",
    "date": "2026-11-15T09:00:00.000Z",
    "time": "09:30 AM - 05:00 PM",
    "venue": "APJ Abdul Kalam Auditorium",
    "location": "Main Campus, Hyderabad",
    "bannerUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    "capacity": 250,
    "availableSeats": 242,
    "ticketPrice": 199,
    "status": "published",
    "organizer": {
      "_id": "674cc0000000000000000000",
      "name": "System Administrator",
      "email": "admin@skillorbit.com"
    }
  }
}
```
- **Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "message": "Event not found"
}
```

---

### 4.4 Create Event
`POST /api/events`
Creates a new event entity. Initial `availableSeats` is set to equal `capacity`.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Request Body:**
```json
{
  "title": "Cybersecurity DefCon Workshop",
  "description": "Hands-on threat intelligence, ethical hacking, and network forensics session.",
  "category": "Workshop",
  "date": "2026-12-05T10:00:00.000Z",
  "time": "10:00 AM - 04:00 PM",
  "venue": "Cyber Defense Lab 402",
  "location": "Tech Tower Block B",
  "bannerUrl": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  "capacity": 60,
  "ticketPrice": 99,
  "status": "published"
}
```
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "674cc0090000000000000009",
    "title": "Cybersecurity DefCon Workshop",
    "capacity": 60,
    "availableSeats": 60,
    "ticketPrice": 99,
    "status": "published",
    "organizer": "674cc0000000000000000000",
    "createdAt": "2026-10-01T14:20:00.000Z"
  }
}
```

---

### 4.5 Update Event
`PUT /api/events/:id`
Updates event fields. Automatically recalculates remaining available seats if total capacity is modified, while rejecting any modification that reduces capacity below already reserved seats.

- **Access:** Admin only (`Bearer <admin_token>`)
- **URL Parameters:** `id` (Event ObjectId)
- **Request Body:** Any subset of event fields (`title`, `description`, `date`, `time`, `venue`, `capacity`, `ticketPrice`, `status`, etc.).
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": { ... }
}
```
- **Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Cannot reduce capacity below currently booked seats (15)"
}
```

---

### 4.6 Delete Event
`DELETE /api/events/:id`
Deletes an event if zero confirmed bookings exist. If active bookings exist, transitions status to `'cancelled'` to preserve audit trail and prevent data corruption.

- **Access:** Admin only (`Bearer <admin_token>`)
- **URL Parameters:** `id` (Event ObjectId)
- **Success Response (No bookings - Hard deleted - `200 OK`):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```
- **Success Response (Active bookings - Soft cancelled - `200 OK`):**
```json
{
  "success": true,
  "message": "Event has 4 active booking(s). Status set to cancelled to protect historical data.",
  "event": { ... }
}
```

---

## 5. Ticket Booking & Passes (`/api/bookings`)

### 5.1 Create Ticket Reservation
`POST /api/bookings`
Atomically reserves seats and generates a unique ticket pass. Protected by MongoDB concurrency guards and anti-double booking limits.

- **Access:** Authenticated User or Admin (`Bearer <token>`)
- **Request Body:**
```json
{
  "eventId": "674cc0020000000000000002",
  "seatsBooked": 2,
  "attendeeName": "Jane Doe",
  "attendeeEmail": "jane.doe@example.com"
}
```
- **Validation & Concurrency Guards:**
  - `seatsBooked`: Positive integer between 1 and 10.
  - Event must exist and have `status: "published"`.
  - Event date must not be in the past.
  - Cumulative confirmed tickets by user for this event cannot exceed 10.
  - Executes atomic `availableSeats: { $gte: seats }` check to guarantee zero overselling.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully!",
  "booking": {
    "_id": "674cc0100000000000000010",
    "bookingReference": "EVT-20261001-C72B94",
    "user": {
      "_id": "674cc0010000000000000001",
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    },
    "event": {
      "_id": "674cc0020000000000000002",
      "title": "Full-Stack Cloud Architecture Summit",
      "date": "2026-11-15T09:00:00.000Z",
      "time": "09:30 AM - 05:00 PM",
      "venue": "APJ Abdul Kalam Auditorium",
      "location": "Main Campus, Hyderabad",
      "bannerUrl": "https://images.unsplash.com/...",
      "ticketPrice": 199
    },
    "seatsBooked": 2,
    "unitPrice": 199,
    "totalAmount": 398,
    "status": "confirmed",
    "attendeeName": "Jane Doe",
    "attendeeEmail": "jane.doe@example.com",
    "bookingDate": "2026-10-01T14:25:00.000Z",
    "createdAt": "2026-10-01T14:25:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{"success": false, "message": "Insufficient seats available. Only 1 seat(s) remaining."}`
  - `400 Bad Request`: `{"success": false, "message": "Maximum ticket limit reached. You already have 9 confirmed ticket(s) for this event. Maximum per attendee is 10."}`

---

### 5.2 Get User Booking History
`GET /api/bookings/my`
Retrieves all booking transactions created by the authenticated user, sorted in descending chronological order.

- **Access:** Private (`Bearer <token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 3,
  "bookings": [ ... ]
}
```

---

### 5.3 Get User Dashboard Overview
`GET /api/bookings/user/dashboard`
Aggregates summary statistics, upcoming active passes, recent activity, and smart recommendations.

- **Access:** Private (`Bearer <token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBookings": 4,
      "activePasses": 3,
      "cancelledCount": 1,
      "totalTickets": 6
    },
    "upcomingBookings": [ ... ],
    "recentBookings": [ ... ],
    "discoverEvents": [ ... ]
  }
}
```

---

### 5.4 Get Booking By ID or Reference
`GET /api/bookings/:id`
Retrieves booking details either by MongoDB ObjectId or reference code (`EVT-YYYYMMDD-XXXX`). Restricted to booking owner or admin.

- **Access:** Private (Owner or Admin)
- **URL Parameters:** `id` (`EVT-...` or ObjectId)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "booking": { ... }
}
```
- **Error Response (`403 Forbidden`):**
```json
{
  "success": false,
  "message": "Not authorized to view this booking"
}
```

---

### 5.5 Cancel Booking
`PUT /api/bookings/:id/cancel`
Cancels reservation and atomically returns reserved seats back to the event pool.

- **Access:** Private (Owner or Admin)
- **URL Parameters:** `id` (Booking ObjectId)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully and reserved seats released back to event",
  "booking": {
    "_id": "674cc0100000000000000010",
    "status": "cancelled",
    ...
  }
}
```
- **Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "This booking is already cancelled"
}
```

---

## 6. Admin Analytics & Management (`/api/admin`)

### 6.1 Get Admin Dashboard Analytics
`GET /api/admin/dashboard`
Computes real-time platform metrics, 6-month booking trends, and category distribution.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEvents": 8,
      "publishedEvents": 7,
      "upcomingEvents": 6,
      "totalUsers": 24,
      "totalBookings": 42,
      "totalTicketsBooked": 89,
      "totalRevenue": 14250
    },
    "categoryDistribution": [
      { "category": "Workshop", "count": 4 },
      { "category": "Conference", "count": 2 },
      { "category": "Concert", "count": 1 },
      { "category": "Tech Talk", "count": 1 }
    ],
    "bookingTrends": [
      { "month": "May 2026", "bookings": 4, "tickets": 8 },
      { "month": "Jun 2026", "bookings": 7, "tickets": 15 },
      { "month": "Jul 2026", "bookings": 10, "tickets": 22 },
      { "month": "Aug 2026", "bookings": 12, "tickets": 25 },
      { "month": "Sep 2026", "bookings": 18, "tickets": 38 },
      { "month": "Oct 2026", "bookings": 42, "tickets": 89 }
    ],
    "recentBookings": [ ... ]
  }
}
```

---

### 6.2 Get All Bookings Audit List
`GET /api/admin/bookings`
Returns master list of all bookings across all users for administrative review.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 42,
  "bookings": [ ... ]
}
```

---

### 6.3 Get All Users Master List
`GET /api/admin/users`
Returns all registered user accounts with sanitized passwords.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 24,
  "users": [ ... ]
}
```

---

## 7. Reports & CSV Exports (`/api/reports`)

### 7.1 Export Bookings CSV
`GET /api/reports/bookings/csv`
Generates a downloadable CSV containing full booking and attendee audit history.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Response Headers:**
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="bookings-report-YYYY-MM-DD.csv"`
- **CSV Columns:**
  `BookingReference`, `AttendeeName`, `AttendeeEmail`, `EventTitle`, `EventDate`, `Venue`, `TicketsBooked`, `UnitPrice`, `TotalAmount`, `Status`, `BookingDate`

---

### 7.2 Export Events Occupancy CSV
`GET /api/reports/events/csv`
Generates a downloadable CSV summarizing event capacity utilization and seat occupancy rates.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Response Headers:**
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="events-summary-YYYY-MM-DD.csv"`
- **CSV Columns:**
  `EventId`, `Title`, `Category`, `Date`, `Time`, `Venue`, `Location`, `TotalCapacity`, `AvailableSeats`, `BookedSeats`, `OccupancyPercent`, `Status`, `TicketPrice`

---

## 8. Media Uploads (`/api/uploads`)

### 8.1 Upload Event Banner Image
`POST /api/uploads`
Accepts image file uploads (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) up to 5MB, stores file in `/uploads` on the backend, and returns public URL.

- **Access:** Admin only (`Bearer <admin_token>`)
- **Request Format:** `multipart/form-data`
- **Field Name:** `image`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "http://localhost:5000/uploads/banner-1727785000000-987654.jpg",
  "filename": "banner-1727785000000-987654.jpg"
}
```
- **Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Only image files (jpeg, jpg, png, webp, gif) are allowed!"
}
```
