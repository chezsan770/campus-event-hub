import axiosInstance from './axiosInstance';
import { DUMMY_USERS } from '../data/dummyData';

export const userService = {
  /** GET /users (admin) */
  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(DUMMY_USERS), 400);
    });
    // const response = await axiosInstance.get('/users');
    // return response.data;
  },

  /** GET /users/:id */
  getUserById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DUMMY_USERS.find(u => u.id === Number(id));
        if (user) resolve(user);
        else reject(new Error('User not found'));
      }, 300);
    });
    // const response = await axiosInstance.get(`/users/${id}`);
    // return response.data;
  },

  /** PUT /users/:id */
  updateUser: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, ...data }), 400);
    });
    // const response = await axiosInstance.put(`/users/${id}`, data);
    // return response.data;
  },

  /** DELETE /users/:id (admin) */
  deleteUser: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'User deleted' }), 300);
    });
    // await axiosInstance.delete(`/users/${id}`);
  },
};
