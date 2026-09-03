// backend/src/controllers/analytics.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  public static async getMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await AnalyticsService.getUserMetrics(req.user!.userId);
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}