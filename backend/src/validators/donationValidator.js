import { body } from 'express-validator';

export const createDonationValidator = [
  body('food_type')
    .trim()
    .notEmpty().withMessage('Food item description is required'),
  body('quantity')
    .trim()
    .notEmpty().withMessage('Quantity is required'),
  body('freshness')
    .trim()
    .notEmpty().withMessage('Freshness/condition is required'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Contact phone number is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location or GPS map link is required'),
  body('expiry')
    .notEmpty().withMessage('Expiry deadline is required')
    .isISO8601().withMessage('Expiry must be a valid ISO date/time format'),
  body('availability_from')
    .notEmpty().withMessage('Availability start time is required')
    .isISO8601().withMessage('Availability start must be a valid ISO date/time format'),
  body('availability_to')
    .notEmpty().withMessage('Availability end time is required')
    .isISO8601().withMessage('Availability end must be a valid ISO date/time format')
];
