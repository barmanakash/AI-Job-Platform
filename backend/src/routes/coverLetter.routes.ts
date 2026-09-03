// backend/src/routes/coverLetter.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateCoverLetterSchema } from '../validators/coverLetter.validator';
import { CoverLetterController } from '../controllers/coverLetter.controller';

const router = Router();

router.use(authenticate);

router.post('/generate', validate(generateCoverLetterSchema), CoverLetterController.generate);
router.get('/job/:jobId', CoverLetterController.getByJob);

export default router;