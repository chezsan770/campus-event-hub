import axiosInstance from './axiosInstance';
import { DUMMY_EVENTS } from '../data/dummyData';

export const eventService = {
  /** GET /events — paginated + filterable */
  getEvents: async ({ page = 0, size = 12, category = '', search = '', status = '' } = {}) => {
    // ── DUMMY ──
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...DUMMY_EVENTS];
        if (category) filtered = filtered.filter(e => e.category === category);
        if (status)   filtered = filtered.filter(e => e.status   === status);
        if (search)   filtered = filtered.filter(e =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
        );
        resolve({ content: filtered, totalElements: filtered.length, totalPages: 1 });
      }, 400);
    });
    // ── REAL ──
    // const response = await axiosInstance.get('/events', { params: { page, size, category, search, status } });
    // return response.data;
  },

  /** GET /events/:id */
  getEventById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = DUMMY_EVENTS.find(e => e.id === Number(id));
        if (event) resolve(event);
        else reject(new Error('Event not found'));
      }, 300);
    });
    // const response = await axiosInstance.get(`/events/${id}`);
    // return response.data;
  },

  /** POST /events */
  createEvent: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id: Date.now(), ...data, status: 'PENDING' }), 500);
    });
    // const response = await axiosInstance.post('/events', data);
    // return response.data;
  },

  /** PUT /events/:id */
  updateEvent: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, ...data }), 400);
    });
    // const response = await axiosInstance.put(`/events/${id}`, data);
    // return response.data;
  },

  /** DELETE /events/:id */
  deleteEvent: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Event deleted' }), 300);
    });
    // await axiosInstance.delete(`/events/${id}`);
  },

  /** POST /events/:id/register */
  registerForEvent: async (eventId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Successfully registered!', ticketId: `TKT-${Date.now()}` }), 500);
    });
    // const response = await axiosInstance.post(`/events/${eventId}/register`);
    // return response.data;
  },

  /** POST /events/:id/approve (admin) */
  approveEvent: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'Event approved' }), 300);
    });
    // const response = await axiosInstance.post(`/events/${id}/approve`);
    // return response.data;
  },
};
