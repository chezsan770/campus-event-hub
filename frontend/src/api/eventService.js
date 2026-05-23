import axiosInstance from './axiosInstance';

export const eventService = {
  getEvents: async ({ page = 0, size = 12, category = '', search = '', status = '' } = {}) => {
    const response = await axiosInstance.get('/events', { params: { page, size, category, search, status } });
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await axiosInstance.get('/events/featured');
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  getEventById: async (id) => {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await axiosInstance.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await axiosInstance.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await axiosInstance.post(`/events/${eventId}/register`);
    return response.data;
  },

  approveEvent: async (id) => {
    const response = await axiosInstance.post(`/events/${id}/approve`);
    return response.data;
  },
};
