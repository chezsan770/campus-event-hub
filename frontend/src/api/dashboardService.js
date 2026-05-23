import axiosInstance from './axiosInstance';

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/admin');
    return response.data;
  },

  getStudentDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/student');
    return response.data;
  },

  getOrganizerDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/organizer');
    return response.data;
  },
};
