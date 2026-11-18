import api from './api';

export const browseDonations = () => api.get('/donations');
export const createDonation = (data) => api.post('/donations', data);
export const getMyDonations = () => api.get('/donations/my');
export const claimDonation = (id) => api.post(`/donations/${id}/claim`);
export const acceptMission = (id) => api.post(`/donations/${id}/accept-mission`);
export const completeMission = (id) => api.post(`/donations/${id}/complete`);
export const resetMission = (id) => api.post(`/donations/${id}/reset`);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);
