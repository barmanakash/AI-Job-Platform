// backend/src/routes/job.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createJobSchema } from '../validators/job.validator';
import { JobController } from '../controllers/job.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createJobSchema), JobController.createJob);
router.get('/', JobController.getJobs);
router.post('/:id/analyze', JobController.analyzeJob);

export default router;