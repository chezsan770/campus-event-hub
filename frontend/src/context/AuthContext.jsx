/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('ceh_token');
    if (!token) return null;

    const freshUser = await authService.getMe();
    localStorage.setItem('ceh_user', JSON.stringify(freshUser));
    setUser(freshUser);
    return freshUser;
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('ceh_token');
    if (!token) return undefined;

    authService.getMe()
      .then((freshUser) => {
        if (!active) return;
        localStorage.setItem('ceh_user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Keep the cached user if the refresh fails temporarily.
      });

    return () => {
      active = false;
    };
  }, []);

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

  const updateAvatar = async (profilePicture) => {
    const freshUser = await authService.updateAvatar(profilePicture);
    localStorage.setItem('ceh_user', JSON.stringify(freshUser));
    setUser(freshUser);
    return freshUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin     = user?.role === 'ADMIN';
  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';
  const isStudent   = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, googleRegister, logout, refreshUser, updateAvatar, isAdmin, isOrganizer, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
