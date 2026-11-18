import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (credentials) => api.post('/auth/login', credentials);
export const adminLogin = (credentials) => api.post('/auth/admin-login', credentials);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
