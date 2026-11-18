import { body } from 'express-validator';

export const createRequestValidator = [
  body('item_needed')
    .trim()
    .notEmpty().withMessage('Item needed description is required'),
  body('quantity_needed')
    .trim()
    .notEmpty().withMessage('Quantity is required'),
  body('contact_number')
    .trim()
    .notEmpty().withMessage('Contact phone number is required'),
  body('urgency')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Urgency must be Low, Medium, High, or Critical')
];
