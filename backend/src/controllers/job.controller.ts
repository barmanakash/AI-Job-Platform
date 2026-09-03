// backend/src/controllers/job.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { JobModel } from '../models/Job';
import { JobAIService } from '../services/jobAI.service';

export class JobController {
  public static async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await JobModel.create({ ...req.body, user: req.user!.userId });
      res.status(201).json({ success: true, message: 'Job created successfully', data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { archived } = req.query;
      const query: Record<string, unknown> = { user: req.user!.userId };
      
      if (archived !== undefined) {
        query.isArchived = archived === 'true';
      }

      const jobs = await JobModel.find(query).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  public static async analyzeJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const analysis = await JobAIService.analyzeJobDescription(id, req.user!.userId);
      res.status(200).json({ success: true, message: 'Job description analyzed', data: analysis });
    } catch (error) {
      next(error);
    }
  }
}