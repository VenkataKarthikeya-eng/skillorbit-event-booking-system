# SkillOrbit REST API Documentation

**SkillOrbit Web Development Capstone Project: Event Booking System**  
**API Version:** `1.0.0`  
**Protocol:** REST over HTTP/HTTPS  
**Data Format:** JSON (`application/json`) & CSV (`text/csv`)  

---

## 1. Overview & Architecture

The SkillOrbit backend exposes a clean, stateless RESTful API powered by Node.js, Express.js, and MongoDB Atlas. 

### Base URLs
- **Local Development:** `http://localhost:5000`
- **Production Environment:** `https://skillorbit-backend.onrender.com` (or user-configured deployment URL)

### Authentication & Authorization Scheme
Protected endpoints require a JSON Web Token (JWT) transmitted via the standard HTTP `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```
The system implements strict Role-Based Access Control (RBAC):
- **Public:** No authentication header required.
- **User (Attendee):** Valid JWT for any active user account.
- **Admin (Organizer):** Valid JWT where the user's role claim is `'admin'`.

### Standard Response Envelope
All API endpoints return structured JSON bodies:

**Success Response (HTTP 200 / 201):**
```json
{
  "success": true,
  "message": "Descriptive confirmation message",
  "data": { ... }
}
```

**Error Response (HTTP 400 / 401 / 403 / 404 / 409 / 500):**
```json
{
  "success": false,
  "message": "Detailed explanation of the validation or business logic error"
}
```

---

## 2. API Endpoint Directory

| Module | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Public | System status & database connectivity check |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new attendee account |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| **Auth** | `GET` | `/api/auth/me` | Protected (User/Admin) | Retrieve authenticated user profile |
| **Events** | `GET` | `/api/events` | Public | Discover published events with filters & search |
| **Events** | `GET` | `/api/events/:id` | Public | Retrieve single event details |
| **Events** | `GET` | `/api/events/admin/all` | Admin | Retrieve all events (including drafts & cancelled) |
| **Events** | `POST` | `/api/events` | Admin | Create a new event |
| **Events** | `PUT` | `/api/events/:id` | Admin | Update event details & capacity |
| **Events** | `DELETE`| `/api/events/:id` | Admin | Delete event (or soft-cancel if booked) |
| **Bookings**| `POST` | `/api/bookings` | Protected (User) | Concurrency-safe atomic seat booking |
| **Bookings**| `GET` | `/api/bookings/my` | Protected (User) | Get user's personal booking history |
| **Bookings**| `GET` | `/api/bookings/user/dashboard` | Protected (User) | User dashboard stats, active passes & discovery |
| **Bookings**| `GET` | `/api/bookings/:id` | Protected (Owner/Admin) | Get booking details by Mongo ID or Reference |
| **Bookings**| `PUT` | `/api/bookings/:id/cancel` | Protected (Owner/Admin) | Cancel reservation & release reserved seats |
| **Admin** | `GET` | `/api/admin/dashboard` | Admin | Executive analytics, charts data & summary |
| **Admin** | `GET` | `/api/admin/bookings` | Admin | List all system bookings |
| **Admin** | `GET` | `/api/admin/users` | Admin | List all registered users |
| **Reports** | `GET` | `/api/reports/bookings/csv` | Admin | Export RFC 4180 bookings CSV report |
| **Reports** | `GET` | `/api/reports/events/csv` | Admin | Export RFC 4180 events occupancy CSV report |
| **Upload** | `POST` | `/api/upload` | Admin | Upload event banner image (multipart/form-data) |

---

## 3. System & Health Endpoints

### 3.1 Health Check
Checks backend operational status, database connectivity, environment mode, and API version.

- **Method / Path:** `GET /api/health`
- **Access Level:** Public
- **Headers:** None required
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Event Booking System API is operational",
  "timestamp": "2026-10-04T10:00:00.000Z",
  "database": "connected",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 4. Authentication Endpoints (`/api/auth`)

### 4.1 Register User
Creates a new attendee account with role strictly set to `'user'`.

- **Method / Path:** `POST /api/auth/register`
- **Access Level:** Public
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Karthikeya",
  "email": "karthikeya@skillorbit.edu",
  "password": "securePassword123",
  "phone": "+91 9876543210"
}
```
- **Validation Rules:**
  - `name`: Required, 2 to 60 characters.
  - `email`: Required, valid email format, unique in database.
  - `password`: Required, minimum 6 characters.
  - `phone`: Optional string.
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67041a98e3b1234567890abc",
    "name": "Karthikeya",
    "email": "karthikeya@skillorbit.edu",
    "role": "user",
    "phone": "+91 9876543210",
    "createdAt": "2026-10-04T10:05:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing fields or account email already registered.

---

### 4.2 Login User
Authenticates user credentials against the bcrypt password hash and generates a signed JWT.

- **Method / Path:** `POST /api/auth/login`
- **Access Level:** Public
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "karthikeya@skillorbit.edu",
  "password": "securePassword123"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67041a98e3b1234567890abc",
    "name": "Karthikeya",
    "email": "karthikeya@skillorbit.edu",
    "role": "user",
    "phone": "+91 9876543210",
    "createdAt": "2026-10-04T10:05:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid email or incorrect password.

---

### 4.3 Get Current User Profile
Retrieves authenticated profile information using the token.

- **Method / Path:** `GET /api/auth/me`
- **Access Level:** Protected (User / Admin)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "user": {
    "_id": "67041a98e3b1234567890abc",
    "name": "Karthikeya",
    "email": "karthikeya@skillorbit.edu",
    "role": "user",
    "phone": "+91 9876543210",
    "createdAt": "2026-10-04T10:05:00.000Z"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Missing, expired, or malformed JWT token.

---

## 5. Events Endpoints (`/api/events`)

### 5.1 Get Published Events (Catalog & Search)
Returns published events sorted by upcoming date. Supports category filtering, full-text regex keyword search, and upcoming status filter.

- **Method / Path:** `GET /api/events`
- **Access Level:** Public
- **Query Parameters:**
  - `category` *(optional)*: Filter by category (e.g., `'Technology'`, `'Workshops'`).
  - `search` *(optional)*: Case-insensitive search across title, description, venue, and location.
  - `upcoming` *(optional)*: `'true'` to restrict to `date >= now`.
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 1,
  "events": [
    {
      "_id": "67041b31e3b1234567890def",
      "title": "Cloud Native Architecture Summit 2026",
      "description": "Deep-dive into microservices, containerization, and Kubernetes clustering.",
      "category": "Technology",
      "date": "2026-11-15T09:00:00.000Z",
      "time": "09:00 AM",
      "venue": "Main Tech Auditorium",
      "location": "North Campus",
      "bannerUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      "capacity": 150,
      "availableSeats": 142,
      "ticketPrice": 499,
      "organizer": {
        "_id": "67041a98e3b1234567890001",
        "name": "Admin Organizer",
        "email": "admin@skillorbit.edu"
      },
      "status": "published",
      "createdAt": "2026-10-01T08:00:00.000Z",
      "updatedAt": "2026-10-04T10:15:00.000Z"
    }
  ]
}
```

---

### 5.2 Get Event by ID
Returns comprehensive details for a specific event.

- **Method / Path:** `GET /api/events/:id`
- **Access Level:** Public
- **URL Parameters:** `id`: MongoDB ObjectId of the event.
- **Response `200 OK`:**
```json
{
  "success": true,
  "event": {
    "_id": "67041b31e3b1234567890def",
    "title": "Cloud Native Architecture Summit 2026",
    "description": "Deep-dive into microservices...",
    "category": "Technology",
    "date": "2026-11-15T09:00:00.000Z",
    "time": "09:00 AM",
    "venue": "Main Tech Auditorium",
    "location": "North Campus",
    "bannerUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    "capacity": 150,
    "availableSeats": 142,
    "ticketPrice": 499,
    "organizer": {
      "_id": "67041a98e3b1234567890001",
      "name": "Admin Organizer",
      "email": "admin@skillorbit.edu"
    },
    "status": "published"
  }
}
```
- **Error Responses:**
  - `404 Not Found`: Event with specified ID does not exist.

---

### 5.3 Get All Events for Admin
Returns all events regardless of status (including draft and cancelled), ordered by creation date descending.

- **Method / Path:** `GET /api/events/admin/all`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 5,
  "events": [ ... ]
}
```

---

### 5.4 Create Event
Creates and publishes a new event.

- **Method / Path:** `POST /api/events`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Full-Stack Web Engineering Bootcamp",
  "description": "Hands-on React 19, Node.js, and MongoDB development workshop.",
  "category": "Workshops",
  "date": "2026-12-05T10:00:00.000Z",
  "time": "10:00 AM",
  "venue": "Computer Science Lab 3",
  "location": "East Wing, Main Campus",
  "bannerUrl": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "capacity": 60,
  "ticketPrice": 0,
  "status": "published"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": { ... }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing mandatory fields (`title`, `description`, `date`, `time`, `venue`, `capacity`) or invalid positive capacity.

---

### 5.5 Update Event
Updates existing event fields and manages capacity adjustments.

- **Method / Path:** `PUT /api/events/:id`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`, `Content-Type: application/json`
- **Validation Rules:**
  - If `capacity` is changed, `newCapacity` cannot be reduced below the seats already booked by attendees (`event.capacity - event.availableSeats`).
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": { ... }
}
```
- **Error Responses:**
  - `400 Bad Request`: New capacity is less than currently booked seats.
  - `404 Not Found`: Event does not exist.

---

### 5.6 Delete Event
Deletes an event or soft-cancels if active bookings exist.

- **Method / Path:** `DELETE /api/events/:id`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Behavior:**
  - If event has `0` confirmed bookings: Document is permanently removed from the database (`findByIdAndDelete`).
  - If event has `> 0` confirmed bookings: Status is set to `'cancelled'` to maintain financial and historical audit records.
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 6. Bookings Endpoints (`/api/bookings`)

### 6.1 Create Ticket Booking (Atomic Concurrency Engine)
Executes a concurrency-safe atomic reservation with anti-double-booking safeguards.

- **Method / Path:** `POST /api/bookings`
- **Access Level:** Protected (Authenticated User / Admin)
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "eventId": "67041b31e3b1234567890def",
  "seatsBooked": 2,
  "attendeeName": "Karthikeya",
  "attendeeEmail": "karthikeya@skillorbit.edu"
}
```
- **Server-Side Concurrency Safeguards:**
  1. Validates `seatsBooked` is an integer between 1 and 10.
  2. Enforces user cumulative limit: total confirmed tickets for this event across user reservations cannot exceed 10.
  3. Executes atomic MongoDB decrement:
     ```javascript
     Event.findOneAndUpdate(
       { _id: eventId, status: 'published', availableSeats: { $gte: seatsBooked } },
       { $inc: { availableSeats: -seatsBooked } },
       { new: true }
     )
     ```
  4. Generates unique human-readable reference code `EVT-YYYYMMDD-XXXX`.
  5. Immutably records snapshot price and total amount.
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Booking confirmed successfully!",
  "booking": {
    "_id": "67042001e3b1234567890aaa",
    "bookingReference": "EVT-20261004-9842",
    "user": {
      "_id": "67041a98e3b1234567890abc",
      "name": "Karthikeya",
      "email": "karthikeya@skillorbit.edu"
    },
    "event": {
      "_id": "67041b31e3b1234567890def",
      "title": "Cloud Native Architecture Summit 2026",
      "date": "2026-11-15T09:00:00.000Z",
      "time": "09:00 AM",
      "venue": "Main Tech Auditorium",
      "location": "North Campus",
      "ticketPrice": 499
    },
    "seatsBooked": 2,
    "unitPrice": 499,
    "totalAmount": 998,
    "status": "confirmed",
    "attendeeName": "Karthikeya",
    "attendeeEmail": "karthikeya@skillorbit.edu",
    "bookingDate": "2026-10-04T10:20:00.000Z",
    "createdAt": "2026-10-04T10:20:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Exceeds cumulative limit of 10 seats per user, invalid seats count, or insufficient available seats remaining.
  - `404 Not Found`: Target event not found.

---

### 6.2 Get My Bookings
Retrieves all personal ticket bookings for the logged-in attendee.

- **Method / Path:** `GET /api/bookings/my`
- **Access Level:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 2,
  "bookings": [ ... ]
}
```

---

### 6.3 Get User Dashboard
Returns real-time aggregate summary, active passes, upcoming reservations, recent transactions, and recommended discoverable events.

- **Method / Path:** `GET /api/bookings/user/dashboard`
- **Access Level:** Protected
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
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

### 6.4 Get Booking by ID or Reference
Returns detailed pass information using either MongoDB `_id` or string `bookingReference`.

- **Method / Path:** `GET /api/bookings/:id`
- **Access Level:** Protected (Booking Owner or Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "booking": { ... }
}
```
- **Error Responses:**
  - `403 Forbidden`: Authenticated user is not the booking owner and not an admin.
  - `404 Not Found`: Booking reference or ID does not exist.

---

### 6.5 Cancel Booking
Cancels a confirmed booking and executes an atomic seat rollback.

- **Method / Path:** `PUT /api/bookings/:id/cancel`
- **Access Level:** Protected (Booking Owner or Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Behavior:**
  - Sets booking `status` to `'cancelled'`.
  - Atomically increments available seats on the event:
    ```javascript
    Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: booking.seatsBooked }
    })
    ```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully and reserved seats released back to event",
  "booking": { ... }
}
```
- **Error Responses:**
  - `400 Bad Request`: Booking is already cancelled.
  - `403 Forbidden`: User is neither the booking owner nor an admin.
  - `404 Not Found`: Booking not found.

---

## 7. Administrative Management Endpoints (`/api/admin`)

### 7.1 Admin Dashboard Analytics
Aggregates platform telemetry, category distributions, monthly booking trends, and recent registrations.

- **Method / Path:** `GET /api/admin/dashboard`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEvents": 12,
      "publishedEvents": 10,
      "upcomingEvents": 8,
      "totalUsers": 45,
      "totalBookings": 38,
      "totalTicketsBooked": 64,
      "totalRevenue": 24950
    },
    "categoryDistribution": [
      { "category": "Technology", "count": 5 },
      { "category": "Workshops", "count": 4 },
      { "category": "Hackathon", "count": 3 }
    ],
    "bookingTrends": [
      { "month": "May 2026", "bookings": 4, "tickets": 7 },
      { "month": "Jun 2026", "bookings": 9, "tickets": 15 },
      { "month": "Jul 2026", "bookings": 12, "tickets": 21 }
    ],
    "recentBookings": [ ... ]
  }
}
```

---

### 7.2 Get All Bookings (Admin Roster)
Lists all bookings across all users and events.

- **Method / Path:** `GET /api/admin/bookings`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 38,
  "bookings": [ ... ]
}
```

---

### 7.3 Get All Users
Returns all registered user accounts with sensitive password hashes excluded.

- **Method / Path:** `GET /api/admin/users`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 45,
  "users": [
    {
      "_id": "67041a98e3b1234567890abc",
      "name": "Karthikeya",
      "email": "karthikeya@skillorbit.edu",
      "role": "user",
      "phone": "+91 9876543210",
      "createdAt": "2026-10-04T10:05:00.000Z"
    }
  ]
}
```

---

## 8. CSV Reporting Endpoints (`/api/reports`)

### 8.1 Export Bookings CSV
Generates a downloadable RFC 4180 CSV export containing all historical booking transactions.

- **Method / Path:** `GET /api/reports/bookings/csv`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response Headers:**
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="bookings-report-YYYY-MM-DD.csv"`
- **CSV Headers:** `BookingReference, AttendeeName, AttendeeEmail, EventTitle, EventDate, Venue, TicketsBooked, UnitPrice, TotalAmount, Status, BookingDate`

---

### 8.2 Export Events Occupancy CSV
Generates a downloadable RFC 4180 CSV export of event capacities, occupancy rates, and ticket revenues.

- **Method / Path:** `GET /api/reports/events/csv`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response Headers:**
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="events-summary-YYYY-MM-DD.csv"`
- **CSV Headers:** `EventId, Title, Category, Date, Time, Venue, Location, TotalCapacity, AvailableSeats, BookedSeats, OccupancyPercent, Status, TicketPrice`

---

## 9. Media Upload Endpoint (`/api/upload`)

### 9.1 Upload Event Banner Image
Handles multipart image uploads via Multer, storing banners in `backend/uploads/` and returning absolute URLs.

- **Method / Path:** `POST /api/upload`
- **Access Level:** Admin only
- **Headers:** `Authorization: Bearer <admin_token>`, `Content-Type: multipart/form-data`
- **Form Data Field:** `image` (JPEG, PNG, WebP image file; max 5MB)
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "http://localhost:5000/uploads/banner-1728045600000.png",
  "filename": "banner-1728045600000.png"
}
```
- **Error Responses:**
  - `400 Bad Request`: No file provided or invalid mime-type (non-image file).

---

## 10. HTTP Status Code Reference

| Status Code | Description | Standard Usage in SkillOrbit |
| :--- | :--- | :--- |
| **200 OK** | Request succeeded | Standard queries, profile retrieval, updates, deletions |
| **201 Created** | Resource created | Account registration, event creation, booking confirmation |
| **400 Bad Request** | Validation failed | Missing required fields, capacity violations, invalid inputs |
| **401 Unauthorized**| Authentication missing/invalid | Missing or expired JWT, incorrect login credentials |
| **403 Forbidden** | Access denied | Non-admin attempting admin routes, accessing another user's pass |
| **404 Not Found** | Resource missing | Event or booking ID does not exist |
| **409 Conflict** | Concurrency conflict | Race condition during booking: event sold out during request |
| **500 Internal Error**| Unexpected exception | Unhandled server error handled by centralized error middleware |
