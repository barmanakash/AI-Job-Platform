// backend/src/routes/profile.routes.ts
import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/auth.validator';
import { ProfileModel } from '../models/Profile';

const router = Router();

router.use(authenticate);

// GET /api/users/me -> Retrieve user profile
router.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user!.userId });
    res.status(200).json({
      success: true,
      data: profile || null,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/me -> Create or Update user profile
router.put('/me', validate(updateProfileSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: req.user!.userId },
      { $set: { ...req.body, user: req.user!.userId } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;