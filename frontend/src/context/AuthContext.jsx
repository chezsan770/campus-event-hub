/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ceh_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (credentials) => {
    const { token, user: u } = await authService.login(credentials);
    localStorage.setItem('ceh_token', token);
    localStorage.setItem('ceh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const googleLogin = async (idToken) => {
    const { token, user: u } = await authService.googleLogin(idToken);
    localStorage.setItem('ceh_token', token);
    localStorage.setItem('ceh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const googleRegister = async (data) => {
    const { token, user: u } = await authService.googleRegister(data);
    localStorage.setItem('ceh_token', token);
    localStorage.setItem('ceh_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin     = user?.role === 'ADMIN';
  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';
  const isStudent   = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, googleRegister, logout, isAdmin, isOrganizer, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
