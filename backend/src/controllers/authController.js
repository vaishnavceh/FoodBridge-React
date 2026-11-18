import * as authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role, location } = req.body;
    const result = await authService.registerUser({
      username,
      email,
      password,
      role,
      location
    });

    // Set HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 'Registration successful!', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser({ username, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 'Login successful!', result);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginAdmin({ username, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 'Admin authentication successful!', result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return successResponse(res, 'Logged out successfully');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return successResponse(res, 'Current user profile', user);
  } catch (error) {
    next(error);
  }
};
