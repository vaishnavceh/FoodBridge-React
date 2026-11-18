import * as dashboardService from '../services/dashboardService.js';
import { successResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return successResponse(res, 'Dashboard statistics', stats);
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    if (req.user.role === 'ngo') {
      const alerts = await dashboardService.getNgoAlerts(req.user.id);
      return successResponse(res, 'NGO alerts', alerts);
    }
    return successResponse(res, 'No alerts for this role', []);
  } catch (error) {
    next(error);
  }
};
