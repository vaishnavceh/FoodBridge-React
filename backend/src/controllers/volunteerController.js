import * as volunteerService from '../services/volunteerService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await volunteerService.getTasks(req.user.id);
    return successResponse(res, 'Volunteer missions retrieved', tasks);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await volunteerService.getHistory(req.user.id);
    return successResponse(res, 'Volunteer history retrieved', history);
  } catch (error) {
    next(error);
  }
};
