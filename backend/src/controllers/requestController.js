import * as requestService from '../services/requestService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getOpen = async (req, res, next) => {
  try {
    const requests = await requestService.getOpenRequests();
    return successResponse(res, 'Open requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

export const getMy = async (req, res, next) => {
  try {
    const requests = await requestService.getMyRequests(req.user.id);
    return successResponse(res, 'My requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const request = await requestService.createRequest(req.user.id, req.body);
    return successResponse(res, 'Need broadcasted successfully', request, 201);
  } catch (error) {
    next(error);
  }
};

export const fulfill = async (req, res, next) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const result = await requestService.fulfillRequest(requestId, req.user.id);
    return successResponse(
      res,
      'Mission accepted! Delivery mission has been created for volunteers.',
      result
    );
  } catch (error) {
    next(error);
  }
};

export const getFulfilledByMe = async (req, res, next) => {
  try {
    const requests = await requestService.getFulfilledByMe(req.user.id);
    return successResponse(res, 'Requests fulfilled by me retrieved', requests);
  } catch (error) {
    next(error);
  }
};
