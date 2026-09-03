// backend/src/routes/application.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createApplicationSchema, updateStageSchema } from '../validators/application.validator';
import { ApplicationController } from '../controllers/application.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createApplicationSchema), ApplicationController.create);
router.get('/board', ApplicationController.getBoard);
router.patch('/:id/stage', validate(updateStageSchema), ApplicationController.updateStage);

export default router;