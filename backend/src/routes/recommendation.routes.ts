// backend/src/routes/recommendation.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getRecommendationsSchema } from '../validators/recommendation.validator';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(getRecommendationsSchema), RecommendationController.getRecommendations);

export default router;