// backend/src/routes/resume.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadResumeMiddleware } from '../middleware/fileUpload';
import { ResumeController } from '../controllers/resume.controller';

const router = Router();

router.use(authenticate);

router.post('/', uploadResumeMiddleware.single('file'), ResumeController.uploadResume);
router.get('/', ResumeController.getUserResumes);
router.post('/:id/analyze', ResumeController.analyzeResume);
router.post('/improve', ResumeController.improveSection);

export default router;