import api from './api';

export const getOpenRequests = () => api.get('/requests');
export const getMyRequests = () => api.get('/requests/my');
export const createRequest = (data) => api.post('/requests', data);
export const fulfillRequest = (id) => api.post(`/requests/${id}/fulfill`);
export const getFulfilledByMe = () => api.get('/requests/fulfilled-by-me');
