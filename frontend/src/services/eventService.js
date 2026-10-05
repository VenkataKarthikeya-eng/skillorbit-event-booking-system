import api from './api';

export const eventService = {
  /**
   * Get all published events with optional filtering
   */
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.upcoming) query.append('upcoming', params.upcoming);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/events${queryString}`);
    return response.data;
  },

  /**
   * Admin: Get all events including drafts and cancelled
   */
  async getAllEventsAdmin() {
    const response = await api.get('/events/admin/all');
    return response.data;
  },

  /**
   * Get single event by ID
   */
  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Admin: Create a new event
   */
  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  /**
   * Admin: Update an event by ID
   */
  async updateEvent(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  /**
   * Admin: Delete or cancel an event by ID
   */
  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  /**
   * Admin: Upload event banner image
   */
  async uploadBanner(formData) {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default eventService;
