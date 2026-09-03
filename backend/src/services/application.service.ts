// backend/src/services/application.service.ts
import { ApplicationModel, IApplication, ApplicationStage } from '../models/Application';

export class ApplicationService {
  public static async createApplication(
    userId: string,
    payload: { jobId: string; resumeId?: string; stage?: ApplicationStage; notes?: string }
  ): Promise<IApplication> {
    const existing = await ApplicationModel.findOne({ user: userId, job: payload.jobId });
    if (existing) {
      throw { statusCode: 409, message: 'Application already tracked for this job', code: 'ALREADY_EXISTS' };
    }

    const application = await ApplicationModel.create({
      user: userId,
      job: payload.jobId,
      resume: payload.resumeId,
      stage: payload.stage || ApplicationStage.WISHLIST,
      notes: payload.notes || '',
      activityLog: [{ stage: payload.stage || ApplicationStage.WISHLIST, date: new Date(), notes: 'Application tracked' }],
    });

    return application;
  }

  public static async updateStage(
    applicationId: string,
    userId: string,
    stage: ApplicationStage,
    positionOrder: number,
    notes?: string
  ): Promise<IApplication> {
    const application = await ApplicationModel.findOne({ _id: applicationId, user: userId });
    if (!application) {
      throw { statusCode: 404, message: 'Application not found', code: 'NOT_FOUND' };
    }

    application.stage = stage;
    application.positionOrder = positionOrder;
    if (notes) application.notes = notes;

    application.activityLog.push({
      stage,
      date: new Date(),
      notes: notes || `Moved stage to ${stage}`,
    });

    await application.save();
    return application;
  }
}