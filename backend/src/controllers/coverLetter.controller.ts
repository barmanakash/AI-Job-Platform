// backend/src/controllers/coverLetter.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { CoverLetterAIService } from '../services/coverLetterAI.service';
import { CoverLetterModel } from '../models/CoverLetter';

export class CoverLetterController {
  public static async generate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, resumeId, hiringManagerName, tone } = req.body;
      const coverLetter = await CoverLetterAIService.generateCoverLetter({
        jobId,
        resumeId,
        userId: req.user!.userId,
        hiringManagerName,
        tone,
      });

      res.status(201).json({
        success: true,
        message: 'Cover letter generated successfully',
        data: coverLetter,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getByJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;
      const coverLetters = await CoverLetterModel.find({ job: jobId, user: req.user!.userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: coverLetters });
    } catch (error) {
      next(error);
    }
  }
}