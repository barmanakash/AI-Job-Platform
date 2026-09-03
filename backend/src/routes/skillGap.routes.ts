// backend/src/routes/skillGap.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { analyzeSkillGapSchema } from '../validators/skillGap.validator';
import { SkillGapController } from '../controllers/skillGap.controller';

const router = Router();

router.use(authenticate);

router.post('/analyze', validate(analyzeSkillGapSchema), SkillGapController.analyze);

export default router;