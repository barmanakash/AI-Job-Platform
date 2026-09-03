// backend/src/controllers/application.controller.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ApplicationModel } from '../models/Application';
import { ApplicationService } from '../services/application.service';

export class ApplicationController {
  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await ApplicationService.createApplication(req.user!.userId, req.body);
      res.status(201).json({ success: true, message: 'Application created', data: application });
    } catch (error) {
      next(error);
    }
  }

  public static async getBoard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await ApplicationModel.find({ user: req.user!.userId })
        .populate('job', 'title company location salary workLocationType')
        .populate('resume', 'title')
        .sort({ positionOrder: 1, updatedAt: -1 });

      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { stage, positionOrder, notes } = req.body;
      const updated = await ApplicationService.updateStage(id, req.user!.userId, stage, positionOrder, notes);
      res.status(200).json({ success: true, message: 'Application stage updated', data: updated });
    } catch (error) {
      next(error);
    }
  }
}