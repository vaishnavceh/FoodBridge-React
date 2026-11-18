import * as donationService from '../services/donationService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const browse = async (req, res, next) => {
  try {
    const donations = await donationService.browseDonations(req.user.id);
    return successResponse(res, 'Active donations retrieved', donations);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const donation = await donationService.createDonation(req.user.id, req.body);
    return successResponse(res, 'Donation broadcast created successfully', donation, 201);
  } catch (error) {
    next(error);
  }
};

export const getMy = async (req, res, next) => {
  try {
    const donations = await donationService.getMyDonations(req.user.id);
    return successResponse(res, 'My donations retrieved', donations);
  } catch (error) {
    next(error);
  }
};

export const claim = async (req, res, next) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    const donation = await donationService.claimDonation(donationId, req.user.id);
    return successResponse(res, 'Donation successfully claimed and reserved', donation);
  } catch (error) {
    next(error);
  }
};

export const acceptMission = async (req, res, next) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    const donation = await donationService.acceptMission(donationId, req.user.id);
    return successResponse(res, 'Mission accepted successfully', donation);
  } catch (error) {
    next(error);
  }
};

export const completeMission = async (req, res, next) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    const donation = await donationService.completeMission(donationId, req.user.id);
    return successResponse(res, 'Mission marked as delivered and completed', donation);
  } catch (error) {
    next(error);
  }
};

export const reset = async (req, res, next) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    const donation = await donationService.resetMission(donationId);
    return successResponse(res, 'Mission reset to available status', donation);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const donationId = parseInt(req.params.id, 10);
    await donationService.deleteDonation(donationId);
    return successResponse(res, 'Donation listing removed successfully');
  } catch (error) {
    next(error);
  }
};
