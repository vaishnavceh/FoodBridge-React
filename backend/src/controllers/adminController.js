import * as adminService from '../services/adminService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();
    return successResponse(res, 'Admin analytics data retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAdminUsers();
    return successResponse(res, 'Users directory retrieved', users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await adminService.deleteUser(userId, req.user.id);
    return successResponse(res, 'User successfully removed from system');
  } catch (error) {
    next(error);
  }
};

export const getLogistics = async (req, res, next) => {
  try {
    const logistics = await adminService.getLogistics();
    return successResponse(res, 'Logistics tracker data retrieved', logistics);
  } catch (error) {
    next(error);
  }
};
