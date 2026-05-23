import axiosInstance from './axiosInstance';

export const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
