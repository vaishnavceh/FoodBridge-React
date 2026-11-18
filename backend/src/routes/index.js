import { Router } from 'express';
import authRoutes from './auth.js';
import donationRoutes from './donations.js';
import requestRoutes from './requests.js';
import volunteerRoutes from './volunteers.js';
import adminRoutes from './admin.js';
import dashboardRoutes from './dashboard.js';
import statsRoutes from './stats.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/donations', donationRoutes);
router.use('/requests', requestRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/stats', statsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FoodBridge REST API'
  });
});

export default router;
