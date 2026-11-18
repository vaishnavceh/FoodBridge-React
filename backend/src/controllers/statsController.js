import * as statsService from '../services/statsService.js';
import { successResponse } from '../utils/response.js';

export const getPublicStats = async (req, res, next) => {
  try {
    const stats = await statsService.getPublicStats();
    return successResponse(res, 'Public impact statistics', stats);
  } catch (error) {
    next(error);
  }
};
