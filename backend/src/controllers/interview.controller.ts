// backend/src/controllers/interview.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { InterviewAIService } from '../services/interviewAI.service';
import { InterviewPrepModel } from '../models/InterviewPrep';

export class InterviewController {
  public static async generate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, resumeId } = req.body;
      const prep = await InterviewAIService.generatePrep(jobId, resumeId, req.user!.userId);
      res.status(200).json({ success: true, message: 'Interview prep questions generated', data: prep });
    } catch (error) {
      next(error);
    }
  }

  public static async getByJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;
      const prep = await InterviewPrepModel.findOne({ job: jobId, user: req.user!.userId });
      res.status(200).json({ success: true, data: prep });
    } catch (error) {
      next(error);
    }
  }
}