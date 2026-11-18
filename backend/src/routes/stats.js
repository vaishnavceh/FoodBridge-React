import { Router } from 'express';
import * as statsController from '../controllers/statsController.js';

const router = Router();

router.get('/public', statsController.getPublicStats);

export default router;
