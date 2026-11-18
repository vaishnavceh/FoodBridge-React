import { Router } from 'express';
import * as volunteerController from '../controllers/volunteerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = Router();

router.use(authenticate, authorize('volunteer'));

router.get('/tasks', volunteerController.getTasks);
router.get('/history', volunteerController.getHistory);

export default router;
