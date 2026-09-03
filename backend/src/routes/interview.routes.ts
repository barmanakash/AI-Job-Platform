// backend/src/routes/interview.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateInterviewPrepSchema } from '../validators/interview.validator';
import { InterviewController } from '../controllers/interview.controller';

const router = Router();

router.use(authenticate);

router.post('/generate', validate(generateInterviewPrepSchema), InterviewController.generate);
router.get('/job/:jobId', InterviewController.getByJob);

export default router;