import api from './api';

export const getVolunteerTasks = () => api.get('/volunteers/tasks');
export const getVolunteerHistory = () => api.get('/volunteers/history');
