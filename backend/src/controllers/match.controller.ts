// backend/src/controllers/match.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { MatchAIService } from '../services/matchAI.service';

export class MatchController {
  public static async calculateMatch(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resumeId, jobId } = req.body;
      const matchResult = await MatchAIService.evaluateMatch(resumeId, jobId, req.user!.userId);
      res.status(200).json({ success: true, message: 'Match score generated', data: matchResult });
    } catch (error) {
      next(error);
    }
  }
}