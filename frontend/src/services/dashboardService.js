import api from './api';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardAlerts = () => api.get('/dashboard/alerts');
