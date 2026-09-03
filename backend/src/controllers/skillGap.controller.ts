// backend/src/controllers/skillGap.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SkillGapAIService } from '../services/skillGapAI.service';

export class SkillGapController {
  public static async analyze(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, resumeId } = req.body;
      const result = await SkillGapAIService.generateSkillGapMatrix(jobId, resumeId, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Skill gap matrix and roadmap generated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}