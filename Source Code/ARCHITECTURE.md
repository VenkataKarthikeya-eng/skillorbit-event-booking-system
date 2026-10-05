# System Architecture: Event Booking System
**Web Development Capstone Project :  SkillOrbit**

---

## 1. High-Level System Architecture

The Event Booking System follows a clean, decoupled **Client-Server Architecture** communicating over a RESTful JSON API.

```mermaid
flowchart TD
    Client["Client Layer (React + Vite + Tailwind)"]
    API["API Gateway & Server (Node.js + Express.js)"]
    Auth["JWT & Role Authorization Middleware"]
    Controllers["Controllers (Auth, Events, Bookings, Analytics)"]
    Database[("Database Layer (MongoDB Atlas / Mongoose)")]
    CloudMedia["Media Storage (Cloudinary / Local Fallback)"]

    Client -->|HTTP / JSON Requests| API
    API --> Auth
    Auth --> Controllers
    Controllers -->|Mongoose ODM| Database
    Controllers -->|Banner Upload| CloudMedia
```

---

## 2. Frontend Architecture (React.js + Vite)

The frontend is structured modularly for maintainability, high performance, and clear separation of concerns.

```
frontend/
├── public/                  # Static assets & favicons
├── src/
│   ├── assets/              # Logos, placeholders, demo imagery
│   ├── components/
│   │   ├── common/          # Navbar, Footer, Button, Input, Modal, Badge, Toast
│   │   ├── events/          # EventCard, EventGrid, EventFilter, EventSearch
│   │   ├── bookings/        # BookingModal, TicketCounter, ConfirmationCard
│   │   └── dashboard/       # StatCard, TrendChart, CategoryChart, RecentBookingsTable
│   ├── context/
│   │   └── AuthContext.jsx  # Global session, user credentials, login/logout actions
│   ├── hooks/
│   │   ├── useAuth.js       # Hook to access auth context
│   │   └── useFetch.js      # Utility hook for asynchronous operations
│   ├── layouts/
│   │   ├── MainLayout.jsx   # Public/User wrapper with Navbar & Footer
│   │   └── AdminLayout.jsx  # Admin wrapper with Sidebar & Topbar
│   ├── pages/
│   │   ├── public/          # Home, EventListing, EventDetails, Login, Register, NotFound
│   │   ├── user/            # UserDashboard, MyBookings, BookingConfirmation
│   │   └── admin/           # AdminDashboard, ManageEvents, CreateEvent, EditEvent, ManageBookings, Reports
│   ├── routes/
│   │   ├── AppRoutes.jsx    # BrowserRouter with route definitions
│   │   ├── ProtectedRoute.jsx # Guard for logged-in users
│   │   └── AdminRoute.jsx   # Guard restricted to role: 'admin'
│   ├── services/
│   │   ├── api.js           # Central Axios instance with JWT interceptor
│   │   ├── authService.js   # Login, Register, getCurrentUser
│   │   ├── eventService.js  # Event CRUD operations
│   │   ├── bookingService.js# Booking submission, user bookings, cancel
│   │   └── reportService.js # Admin metrics & CSV export download
│   ├── utils/
│   │   ├── formatters.js    # Date, currency, string helpers
│   │   └── validators.js    # Client-side input validation rules
│   ├── App.jsx
│   ├── index.css            # Tailwind directives & base styles
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 3. Backend Architecture (Node.js + Express.js)

The backend follows the **Controller-Service-Repository/Model** pattern to keep business logic isolated and testable.

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB Atlas connection handler
│   │   └── cloudinary.js    # Cloudinary SDK configuration & fallbacks
│   ├── controllers/
│   │   ├── authController.js    # Registration, login, current profile
│   │   ├── eventController.js   # List, get, create, update, delete events
│   │   ├── bookingController.js # Create booking, get user bookings, cancel
│   │   ├── adminController.js   # Dashboard metrics, all bookings, user lists
│   │   └── reportController.js  # CSV export generators
│   ├── middleware/
│   │   ├── authMiddleware.js    # Verify Bearer JWT
│   │   ├── roleMiddleware.js    # Verify Admin privileges
│   │   ├── errorMiddleware.js   # Centralized error and 404 handler
│   │   └── uploadMiddleware.js  # Multer handling for images
│   ├── models/
│   │   ├── User.js              # User schema (roles, bcrypt pre-save)
│   │   ├── Event.js             # Event schema (capacity, seats, schedule)
│   │   └── Booking.js           # Booking schema (ref, tickets, status)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── adminRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/
│   │   ├── generateReference.js # Unique booking reference generator
│   │   └── seedData.js          # Seed initial sample events & admin account
│   ├── app.js                   # Express app setup, CORS, JSON parsers, routes
│   └── server.js                # Server listener entry point
├── .env.example
├── package.json
└── vercel.json / render.yaml
```

---

## 4. Database Architecture (MongoDB Schemas)

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    USER ||--o{ EVENT : organizes
    EVENT ||--o{ BOOKING : contains

    USER {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string role "user | admin"
        date createdAt
        date updatedAt
    }

    EVENT {
        ObjectId _id PK
        string title
        string description
        string category
        date date
        string time
        string venue
        string location
        string bannerUrl
        number capacity
        number availableSeats
        number ticketPrice
        ObjectId organizer FK
        string status "draft | published | cancelled | completed"
        date createdAt
        date updatedAt
    }

    BOOKING {
        ObjectId _id PK
        string bookingReference UK
        ObjectId user FK
        ObjectId event FK
        number seatsBooked
        number totalAmount
        string status "confirmed | cancelled"
        date bookingDate
        date createdAt
    }
```

### Key Integrity Rules:
1. **Seat Integrity**: `availableSeats` is checked and decremented atomically via `{ $inc: { availableSeats: -seatsBooked } }` with condition `{ availableSeats: { $gte: seatsBooked } }`.
2. **Reference Uniqueness**: `bookingReference` has a unique index to ensure zero collision.
3. **Role Segregation**: Users cannot self-assign `admin` role upon registration.

---

## 5. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Admin
    participant Client as React Client (AuthContext)
    participant API as Express Auth API
    participant DB as MongoDB Atlas

    User->>Client: Enters Credentials (Email & Password)
    Client->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email })
    DB-->>API: Return User document
    API->>API: bcrypt.compare(password, passwordHash)
    alt Password Invalid
        API-->>Client: 401 Unauthorized ("Invalid credentials")
    else Password Valid
        API->>API: Sign JWT with payload { id, role, email }
        API-->>Client: 200 OK { token, user: { id, name, email, role } }
        Client->>Client: Store Token in localStorage / memory
        Client->>Client: Set Authorization header for Axios
        Client-->>User: Redirect to User/Admin Dashboard
    end
```

---

## 6. Safe Booking Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant Client as React Frontend
    participant BookingAPI as Booking Controller
    participant EventModel as Event Collection
    participant BookingModel as Booking Collection

    User->>Client: Selects Event & Seats count (e.g. 2)
    Client->>BookingAPI: POST /api/bookings { eventId, seatsBooked: 2 } (with JWT)
    BookingAPI->>BookingAPI: Verify JWT & extract userId
    BookingAPI->>BookingAPI: Validate seatsBooked > 0 & <= maxPerBooking
    BookingAPI->>EventModel: findOneAndUpdate({ _id: eventId, availableSeats: { $gte: 2 }, status: 'published' }, { $inc: { availableSeats: -2 } })
    alt Seats Unavailable or Event Not Found
        EventModel-->>BookingAPI: null (insufficient seats or inactive)
        BookingAPI-->>Client: 400 Bad Request ("Insufficient seats available")
    else Seats Reserved Successfully
        EventModel-->>BookingAPI: Updated Event Doc
        BookingAPI->>BookingAPI: Generate Booking Reference (e.g. BK-20261001-A9F2)
        BookingAPI->>BookingModel: create({ bookingReference, user: userId, event: eventId, seatsBooked: 2, totalAmount })
        BookingModel-->>BookingAPI: Created Booking Doc
        BookingAPI-->>Client: 201 Created { bookingReference, details }
        Client-->>User: Show Instant Confirmation Modal & Receipt
    end
```

---

## 7. Deployment Architecture

- **Client Application**: Hosted on **Vercel** with automatic SPA rewrites (`vercel.json`) pointing to `index.html`.
- **Server Application**: Hosted on **Render** (Web Service, Node environment) with automated health check `/api/health`.
- **Database**: Cloud-hosted **MongoDB Atlas** with IP access configured for production.
- **Media**: **Cloudinary** media storage with secure HTTPS delivery and local filesystem fallback during offline/dev mode.
- **Continuous Integration / Source Control**: Clean repository structure on **GitHub** with separated `.env.example` configurations.
