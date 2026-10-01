require('dotenv').config();
const http = require('http');
const app = require('../src/app');
const connectDB = require('../src/config/db');

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('       SKILLORBIT END-TO-END AUTOMATED TEST SUITE               ');
  console.log('================================================================\n');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ FATAL: Database failed to connect.');
    process.exit(1);
  }

  const port = 5096;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
  const baseUrl = `http://localhost:${port}`;

  async function api(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, options);
    const contentType = res.headers.get('content-type') || '';
    let body;
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { status: res.status, headers: res.headers, body };
  }

  let passed = 0;
  let failed = 0;
  const bugs = [];

  function assert(condition, testName, errorDetails = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} ${errorDetails ? `(${errorDetails})` : ''}`);
      bugs.push(`${testName}: ${errorDetails}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // SECTION 1: Health & Database Connectivity
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: Health & Database Connectivity ---');
    const health = await api('/api/health');
    assert(health.status === 200, 'Health check returns 200');
    assert(health.body.database === 'connected', 'Database status is connected');

    // -------------------------------------------------------------
    // SECTION 2: User Registration & Authentication Edge Cases
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: User Registration & Auth Edge Cases ---');

    const regMissing = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Only Name' }),
    });
    assert(regMissing.status === 400, 'Register with missing email/password returns 400');

    const regShortPass = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Pass User',
        email: `shortpass_${Date.now()}@example.com`,
        password: '123',
      }),
    });
    assert(regShortPass.status === 400, 'Register with password < 6 chars returns 400');

    const userAEmail = `attendee_a_${Date.now()}@example.com`;
    const regUserA = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Attendee Alpha',
        email: userAEmail,
        password: 'Password123!',
      }),
    });
    assert(regUserA.status === 201 && regUserA.body.token, 'Register valid User A returns 201 with token');
    const userAToken = regUserA.body.token;

    const regDuplicate = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Person',
        email: userAEmail,
        password: 'Password123!',
      }),
    });
    assert(regDuplicate.status === 400, 'Duplicate email registration returns 400');

    const userBEmail = `attendee_b_${Date.now()}@example.com`;
    const regUserB = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Attendee Beta',
        email: userBEmail,
        password: 'Password123!',
      }),
    });
    assert(regUserB.status === 201 && regUserB.body.token, 'Register valid User B returns 201 with token');
    const userBToken = regUserB.body.token;

    const loginNoEmail = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Password123!' }),
    });
    assert(loginNoEmail.status === 400, 'Login without email returns 400');

    const loginWrongPass = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAEmail, password: 'WrongPassword123!' }),
    });
    assert(loginWrongPass.status === 401, 'Login with incorrect password returns 401');

    const loginNonexistent = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ghost_nonexistent@example.com', password: 'Password123!' }),
    });
    assert(loginNonexistent.status === 401, 'Login with nonexistent email returns 401');

    const adminLogin = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@skillorbit.com',
        password: 'AdminPassword123!',
      }),
    });
    assert(adminLogin.status === 200 && adminLogin.body.user.role === 'admin', 'Login valid admin returns 200 with admin role');
    const adminToken = adminLogin.body.token;

    const studentLogin = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@skillorbit.com',
        password: 'StudentPassword123!',
      }),
    });
    assert(studentLogin.status === 200 && studentLogin.body.user.role === 'user', 'Login seeded student returns 200 with user role');
    const studentToken = studentLogin.body.token;

    const meValid = await api('/api/auth/me', {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(meValid.status === 200 && meValid.body.user.email === userAEmail, 'GET /api/auth/me returns 200 with profile');

    const meTamperedToken = await api('/api/auth/me', {
      headers: { Authorization: 'Bearer this_is_a_tampered_invalid_token' },
    });
    assert(meTamperedToken.status === 401, 'GET /api/auth/me with tampered token returns 401');

    const meNoToken = await api('/api/auth/me');
    assert(meNoToken.status === 401, 'GET /api/auth/me without token returns 401');

    // -------------------------------------------------------------
    // SECTION 3: Role-Based Access Control (RBAC) Gates
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Role-Based Access Control (RBAC) ---');

    assert((await api('/api/admin/dashboard')).status === 401, 'Unauthenticated GET /api/admin/dashboard returns 401');
    assert(
      (await api('/api/admin/dashboard', { headers: { Authorization: `Bearer ${studentToken}` } })).status === 403,
      'Student GET /api/admin/dashboard returns 403'
    );
    assert(
      (await api('/api/admin/dashboard', { headers: { Authorization: `Bearer ${adminToken}` } })).status === 200,
      'Admin GET /api/admin/dashboard returns 200'
    );

    assert(
      (await api('/api/admin/users', { headers: { Authorization: `Bearer ${studentToken}` } })).status === 403,
      'Student GET /api/admin/users returns 403'
    );
    assert(
      (await api('/api/admin/users', { headers: { Authorization: `Bearer ${adminToken}` } })).status === 200,
      'Admin GET /api/admin/users returns 200'
    );

    assert(
      (await api('/api/admin/bookings', { headers: { Authorization: `Bearer ${studentToken}` } })).status === 403,
      'Student GET /api/admin/bookings returns 403'
    );
    assert(
      (await api('/api/admin/bookings', { headers: { Authorization: `Bearer ${adminToken}` } })).status === 200,
      'Admin GET /api/admin/bookings returns 200'
    );

    assert((await api('/api/reports/bookings/csv')).status === 401, 'Unauthenticated GET /api/reports/bookings/csv returns 401');
    assert(
      (await api('/api/reports/bookings/csv', { headers: { Authorization: `Bearer ${studentToken}` } })).status === 403,
      'Student GET /api/reports/bookings/csv returns 403'
    );
    assert(
      (await api('/api/reports/bookings/csv', { headers: { Authorization: `Bearer ${adminToken}` } })).status === 200,
      'Admin GET /api/reports/bookings/csv returns 200'
    );

    assert((await api('/api/reports/events/csv')).status === 401, 'Unauthenticated GET /api/reports/events/csv returns 401');
    assert(
      (await api('/api/reports/events/csv', { headers: { Authorization: `Bearer ${studentToken}` } })).status === 403,
      'Student GET /api/reports/events/csv returns 403'
    );
    assert(
      (await api('/api/reports/events/csv', { headers: { Authorization: `Bearer ${adminToken}` } })).status === 200,
      'Admin GET /api/reports/events/csv returns 200'
    );

    // -------------------------------------------------------------
    // SECTION 4: Event Management & Edge Cases
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Event Management & Edge Cases ---');

    const catalog = await api('/api/events');
    assert(catalog.status === 200 && Array.isArray(catalog.body.events), 'Public event catalog returns 200 with list');

    const workshopCat = await api('/api/events?category=Workshop');
    assert(workshopCat.status === 200, 'Filter events by category returns 200');

    const searchRes = await api('/api/events?search=Conference');
    assert(searchRes.status === 200, 'Search events by keyword returns 200');

    const invalidEventId = await api('/api/events/invalid_mongo_id_123');
    assert(invalidEventId.status === 404, 'GET event with malformed ObjectId returns 404');

    const nonexistentEvent = await api('/api/events/654321654321654321654321');
    assert(nonexistentEvent.status === 404, 'GET event with nonexistent ObjectId returns 404');

    const createMissing = await api('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ title: 'Just a title' }),
    });
    assert(createMissing.status === 400, 'Create event missing fields returns 400');

    const createBadCap = await api('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Bad Capacity Event',
        description: 'Testing nonpositive capacity',
        date: '2026-12-01',
        time: '10:00 AM',
        venue: 'Hall A',
        capacity: -5,
      }),
    });
    assert(createBadCap.status === 400, 'Create event with negative capacity returns 400');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const createValid = await api('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Production Verification Summit',
        description: 'Comprehensive testing and demonstration summit.',
        category: 'Conference',
        date: futureDate.toISOString().split('T')[0],
        time: '09:00 AM - 05:00 PM',
        venue: 'Main Auditorium',
        location: 'Bengaluru',
        capacity: 20,
        ticketPrice: 500,
        status: 'published',
      }),
    });
    assert(createValid.status === 201 && createValid.body.event, 'Admin create valid event returns 201');
    const testEventId = createValid.body.event._id;

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const createPast = await api('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Past Concluded Event',
        description: 'This event happened in the past.',
        category: 'Networking',
        date: pastDate.toISOString().split('T')[0],
        time: '10:00 AM',
        venue: 'Virtual Room',
        capacity: 10,
        ticketPrice: 0,
        status: 'published',
      }),
    });
    const pastEventId = createPast.body.event._id;

    const createDraft = await api('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Unpublished Draft Event',
        description: 'Not open for bookings.',
        category: 'Tech Talk',
        date: futureDate.toISOString().split('T')[0],
        time: '02:00 PM',
        venue: 'Online',
        capacity: 15,
        ticketPrice: 100,
        status: 'draft',
      }),
    });
    const draftEventId = createDraft.body.event._id;

    // -------------------------------------------------------------
    // SECTION 5: Ticket Booking Workflow & Edge Cases
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Ticket Booking & Concurrency Edge Cases ---');

    const bookUnauth = await api('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: 1 }),
    });
    assert(bookUnauth.status === 401, 'Unauthenticated booking attempt returns 401');

    const bookZero = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: 0 }),
    });
    assert(bookZero.status === 400, 'Booking 0 tickets returns 400');

    const bookNegative = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: -3 }),
    });
    assert(bookNegative.status === 400, 'Booking negative tickets returns 400');

    const bookFloat = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: 2.5 }),
    });
    assert(bookFloat.status === 400, 'Booking float seats (2.5) returns 400');

    const bookOverLimit = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: 12 }),
    });
    assert(bookOverLimit.status === 400, 'Booking > 10 tickets returns 400');

    const bookPast = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: pastEventId, seatsBooked: 1 }),
    });
    assert(bookPast.status === 400, 'Booking a past event returns 400');

    const bookDraft = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: draftEventId, seatsBooked: 1 }),
    });
    assert(bookDraft.status === 400, 'Booking an unpublished draft event returns 400');

    const bookNonexistent = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: '654321654321654321654321', seatsBooked: 1 }),
    });
    assert(bookNonexistent.status === 404, 'Booking a nonexistent event ID returns 404');

    const bookValidA = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({
        eventId: testEventId,
        seatsBooked: 3,
        attendeeName: 'Attendee Alpha',
        attendeeEmail: userAEmail,
      }),
    });
    assert(bookValidA.status === 201 && bookValidA.body.booking, 'User A books 3 seats returns 201');
    const bookingAId = bookValidA.body.booking._id;
    const bookingARef = bookValidA.body.booking.bookingReference;
    assert(bookingARef.startsWith('EVT-'), `Booking reference formatted correctly (${bookingARef})`);

    const checkAfterBookA = await api(`/api/events/${testEventId}`);
    assert(checkAfterBookA.body.event.availableSeats === 17, 'Available seats accurately decremented to 17');

    const updateBelowBooked = await api(`/api/events/${testEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ capacity: 2 }),
    });
    assert(updateBelowBooked.status === 400, 'Attempting to lower capacity below booked seats returns 400');

    const bookExceedUserLimit = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ eventId: testEventId, seatsBooked: 8 }),
    });
    assert(bookExceedUserLimit.status === 400, 'Exceeding 10 cumulative seats per user per event returns 400');

    // -------------------------------------------------------------
    // SECTION 6: Booking Details, Ownership & Permissions
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Booking Details, Ownership & Permissions ---');

    const viewOwner = await api(`/api/bookings/${bookingAId}`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(viewOwner.status === 200, 'Owner User A can view booking details');

    const viewByRef = await api(`/api/bookings/${bookingARef}`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(viewByRef.status === 200 && viewByRef.body.booking.bookingReference === bookingARef, 'View booking by Reference Code returns 200');

    const viewNonOwner = await api(`/api/bookings/${bookingAId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    assert(viewNonOwner.status === 403, 'Non-owner User B attempting to view booking returns 403');

    const viewAdmin = await api(`/api/bookings/${bookingAId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(viewAdmin.status === 200, 'Admin can view any user booking details');

    // -------------------------------------------------------------
    // SECTION 7: Booking Cancellation & Rollback
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Booking Cancellation & Rollback ---');

    const cancelNonOwner = await api(`/api/bookings/${bookingAId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    assert(cancelNonOwner.status === 403, 'Non-owner User B cancelling booking returns 403');

    const cancelOwner = await api(`/api/bookings/${bookingAId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(cancelOwner.status === 200 && cancelOwner.body.booking.status === 'cancelled', 'Owner User A cancels booking successfully');

    const checkAfterCancel = await api(`/api/events/${testEventId}`);
    assert(checkAfterCancel.body.event.availableSeats === 20, 'Available seats rolled back from 17 to 20');

    const cancelAgain = await api(`/api/bookings/${bookingAId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(cancelAgain.status === 400, 'Cancelling already cancelled booking returns 400');

    const cancelNonexistent = await api('/api/bookings/654321654321654321654321/cancel', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(cancelNonexistent.status === 404, 'Cancelling nonexistent booking ID returns 404');

    // -------------------------------------------------------------
    // SECTION 8: User Dashboard & History
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: User Dashboard & History ---');

    const myBookingsRes = await api('/api/bookings/my', {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(myBookingsRes.status === 200 && Array.isArray(myBookingsRes.body.bookings), 'GET /api/bookings/my returns 200 with list');

    const userDashRes = await api('/api/bookings/user/dashboard', {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    assert(userDashRes.status === 200 && userDashRes.body.data.summary, 'GET /api/bookings/user/dashboard returns 200 with summary');
    assert(userDashRes.body.data.summary.cancelledCount >= 1, 'User dashboard correctly shows cancelled reservation count');

    // -------------------------------------------------------------
    // SECTION 9: Admin Analytics, Trends & CSV Reports
    // -------------------------------------------------------------
    console.log('\n--- SECTION 9: Admin Analytics & CSV Reports ---');

    const adminStats = await api('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminStats.status === 200, 'Admin Dashboard stats returns 200');
    assert(typeof adminStats.body.data.summary.totalEvents === 'number', 'Admin stats contains totalEvents');
    assert(typeof adminStats.body.data.summary.totalUsers === 'number', 'Admin stats contains totalUsers');
    assert(Array.isArray(adminStats.body.data.bookingTrends), 'Admin stats contains bookingTrends array');
    assert(Array.isArray(adminStats.body.data.categoryDistribution), 'Admin stats contains categoryDistribution array');

    const csvBookings = await api('/api/reports/bookings/csv', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(csvBookings.status === 200, 'Bookings CSV returns 200');
    assert(csvBookings.headers.get('content-type')?.includes('text/csv'), 'Bookings CSV has text/csv header');
    assert(csvBookings.body.includes('BookingReference'), 'Bookings CSV contains BookingReference column');

    const csvEvents = await api('/api/reports/events/csv', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(csvEvents.status === 200, 'Events CSV returns 200');
    assert(csvEvents.headers.get('content-type')?.includes('text/csv'), 'Events CSV has text/csv header');
    assert(csvEvents.body.includes('TotalCapacity') && csvEvents.body.includes('OccupancyPercent'), 'Events CSV contains TotalCapacity & OccupancyPercent');

    // -------------------------------------------------------------
    // SECTION 10: Event Deletion & Audit Trail Protection
    // -------------------------------------------------------------
    console.log('\n--- SECTION 10: Event Deletion & Audit Trail Protection ---');

    const bookForAuditTest = await api('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userBToken}`,
      },
      body: JSON.stringify({
        eventId: testEventId,
        seatsBooked: 2,
        attendeeName: 'Attendee Beta',
        attendeeEmail: userBEmail,
      }),
    });
    assert(bookForAuditTest.status === 201, 'Book confirmed seat for deletion protection test');

    const deleteWithBookings = await api(`/api/events/${testEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteWithBookings.status === 200, 'Delete event with active bookings returns 200');
    assert(deleteWithBookings.body.event?.status === 'cancelled', 'Event with active bookings transitioned to cancelled status to preserve history');

    const delPast = await api(`/api/events/${pastEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delPast.status === 200, 'Clean up past test event with 0 bookings returns 200');

    const delDraft = await api(`/api/events/${draftEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delDraft.status === 200, 'Clean up draft test event with 0 bookings returns 200');

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`  COMPREHENSIVE TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    if (bugs.length > 0) {
      console.log('  BUGS DETECTED:');
      bugs.forEach((b) => console.log(`   - ${b}`));
    } else {
      console.log('  🎯 100% OF END-TO-END TEST CASES PASSED WITH ZERO FAILURES!');
    }
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    server.close();
    process.exit(0);
  }
}

runComprehensiveTests().catch((err) => {
  console.error('\n❌ TEST RUNNER ERROR:', err.message);
  process.exit(1);
});
