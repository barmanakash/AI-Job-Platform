// backend/src/controllers/recommendation.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { RecommendationAIService } from '../services/recommendationAI.service';

export class RecommendationController {
  public static async getRecommendations(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resumeId, limit } = req.body;
      const recommendations = await RecommendationAIService.generateRecommendations(
        resumeId,
        req.user!.userId,
        limit
      );
      res.status(200).json({
        success: true,
        message: 'Job recommendations calculated',
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}