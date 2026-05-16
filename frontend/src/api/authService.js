import axiosInstance from './axiosInstance';
import { DUMMY_USERS } from '../data/dummyData';

// ─── Auth Service ─────────────────────────────────────────────────────────────
// All methods return Promises. Swap dummy data for real API calls.

export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ token: string, user: object }}
   */
  login: async ({ email, password }) => {
    // ── DUMMY IMPLEMENTATION ──
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DUMMY_USERS.find(u => u.email === email);
        if (user && password === 'password123') {
          const token = `dummy-jwt-${user.id}-${Date.now()}`;
          resolve({ token, user });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 600);
    });

    // ── REAL IMPLEMENTATION (uncomment when Spring Boot is ready) ──
    // const response = await axiosInstance.post('/auth/login', { email, password });
    // return response.data;
  },

  /**
   * POST /auth/register
   * @param {{ name: string, email: string, password: string, role: string }} data
   */
  register: async (data) => {
    // ── DUMMY ──
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Registration successful. Please login.' });
      }, 600);
    });

    // ── REAL ──
    // const response = await axiosInstance.post('/auth/register', data);
    // return response.data;
  },

  /**
   * POST /auth/logout
   */
  logout: async () => {
    localStorage.removeItem('ceh_token');
    localStorage.removeItem('ceh_user');
    // await axiosInstance.post('/auth/logout');
  },

  /**
   * GET /auth/me
   */
  getMe: async () => {
    // ── DUMMY ──
    const stored = localStorage.getItem('ceh_user');
    if (stored) return JSON.parse(stored);
    return null;

    // ── REAL ──
    // const response = await axiosInstance.get('/auth/me');
    // return response.data;
  },
};
