// backend/src/routes/analytics.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.use(authenticate);

router.get('/metrics', AnalyticsController.getMetrics);

export default router;