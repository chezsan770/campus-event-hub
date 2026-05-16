import axiosInstance from './axiosInstance';
import { DUMMY_TICKETS } from '../data/dummyData';

export const ticketService = {
  /** GET /tickets/my */
  getMyTickets: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(DUMMY_TICKETS), 400);
    });
    // const response = await axiosInstance.get('/tickets/my');
    // return response.data;
  },

  /** GET /tickets/:id */
  getTicketById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ticket = DUMMY_TICKETS.find(t => t.id === id);
        if (ticket) resolve(ticket);
        else reject(new Error('Ticket not found'));
      }, 300);
    });
    // const response = await axiosInstance.get(`/tickets/${id}`);
    // return response.data;
  },

  /** POST /tickets/:id/verify (admin/organizer scan) */
  verifyTicket: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ valid: true, message: 'Ticket verified successfully' }), 400);
    });
    // const response = await axiosInstance.post(`/tickets/${id}/verify`);
    // return response.data;
  },
};
