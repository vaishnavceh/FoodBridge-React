import { Router } from 'express';
import * as requestController from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { createRequestValidator } from '../validators/requestValidator.js';

const router = Router();

// All request routes require authentication
router.use(authenticate);

// Open requests visible to donors and admins
router.get('/', authorize('donor', 'admin'), requestController.getOpen);

// NGO specific routes
router.get('/my', authorize('ngo'), requestController.getMy);
router.post('/', authorize('ngo'), createRequestValidator, validate, requestController.create);

// Donor fulfillment routes
router.post('/:id/fulfill', authorize('donor'), requestController.fulfill);
router.get('/fulfilled-by-me', authorize('donor'), requestController.getFulfilledByMe);

export default router;
