// backend/src/routes/match.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { matchRequestSchema } from '../validators/job.validator';
import { MatchController } from '../controllers/match.controller';

const router = Router();

router.use(authenticate);

router.post('/analyze', validate(matchRequestSchema), MatchController.calculateMatch);

export default router;