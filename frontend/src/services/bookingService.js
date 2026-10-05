import api from './api';

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Get current user's booking history
   */
  async getMyBookings() {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  /**
   * Get booking details by ID or Reference
   */
  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(id) {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  /**
   * Get user dashboard metrics and upcoming passes
   */
  async getUserDashboard() {
    const response = await api.get('/bookings/user/dashboard');
    return response.data;
  },
};

export default bookingService;
