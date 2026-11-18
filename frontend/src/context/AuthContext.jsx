import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and restore user on refresh
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authService.login({ username, password });
    const { user: loggedInUser, token: authToken } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const adminLogin = async (username, password) => {
    const res = await authService.adminLogin({ username, password });
    const { user: adminUser, token: authToken } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(adminUser);
    return adminUser;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { user: registeredUser, token: authToken } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isDonor: user?.role === 'donor',
    isNgo: user?.role === 'ngo',
    isVolunteer: user?.role === 'volunteer',
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
