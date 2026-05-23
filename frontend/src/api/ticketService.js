import axiosInstance from './axiosInstance';

export const ticketService = {
  getMyTickets: async () => {
    const response = await axiosInstance.get('/tickets/my');
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await axiosInstance.get(`/tickets/${id}`);
    return response.data;
  },

  verifyTicket: async (id) => {
    const response = await axiosInstance.post(`/tickets/${id}/verify`);
    return response.data;
  },
};
