import api from './api';

export const adminService = {
  /**
   * Fetch aggregate admin dashboard metrics, trends, and recent bookings
   */
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Fetch all bookings for admin management
   */
  async getAllBookings() {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  /**
   * Fetch all registered users
   */
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  /**
   * Download bookings CSV report directly in browser
   */
  async downloadBookingsCSV() {
    const response = await api.get('/reports/bookings/csv', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `bookings-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download events summary CSV report directly in browser
   */
  async downloadEventsCSV() {
    const response = await api.get('/reports/events/csv', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `events-summary-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default adminService;
