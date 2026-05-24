import axiosInstance from './axiosInstance';

export const authService = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await axiosInstance.post('/auth/google/login', { idToken });
    return response.data;
  },

  googleRegister: async (data) => {
    const response = await axiosInstance.post('/auth/google/register', data);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('ceh_token');
    localStorage.removeItem('ceh_user');
    await axiosInstance.post('/auth/logout');
  },

  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  updateAvatar: async (profilePicture) => {
    const response = await axiosInstance.put('/auth/me/avatar', { profilePicture });
    return response.data;
  },
};
