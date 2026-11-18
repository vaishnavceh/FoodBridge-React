import { Router } from 'express';
import * as donationController from '../controllers/donationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { createDonationValidator } from '../validators/donationValidator.js';

const router = Router();

// All donation routes require authentication
router.use(authenticate);

// Browse available donations (for NGO and Volunteer)
router.get('/', authorize('ngo', 'volunteer', 'admin'), donationController.browse);

// Donor routes
router.post('/', authorize('donor'), createDonationValidator, validate, donationController.create);
router.get('/my', authorize('donor'), donationController.getMy);

// NGO claim route
router.post('/:id/claim', authorize('ngo'), donationController.claim);

// Volunteer mission routes
router.post('/:id/accept-mission', authorize('volunteer'), donationController.acceptMission);
router.post('/:id/complete', authorize('volunteer'), donationController.completeMission);

// Admin routes
router.post('/:id/reset', authorize('admin'), donationController.reset);
router.delete('/:id', authorize('admin'), donationController.remove);

export default router;
