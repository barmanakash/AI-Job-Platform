// backend/src/services/analytics.service.ts
import { Types } from 'mongoose';
import { ApplicationModel, ApplicationStage } from '../models/Application';
import { MatchAnalysisModel } from '../models/MatchAnalysis';
import { JobModel } from '../models/Job';
import { ResumeModel } from '../models/Resume';

export interface IUserDashboardMetrics {
  totalResumes: number;
  totalJobsTracked: number;
  applicationsByStage: Record<string, number>;
  averageMatchScore: number;
  conversionRate: number; // (Offers / Total Applications) * 100
  interviewRate: number; // (Interviews / Total Applications) * 100
  recentActivity: Array<{
    type: 'APPLICATION_STAGE' | 'MATCH_EVALUATED';
    title: string;
    timestamp: Date;
  }>;
}

export class AnalyticsService {
  public static async getUserMetrics(userId: string): Promise<IUserDashboardMetrics> {
    const userObjectId = new Types.ObjectId(userId);

    const [resumeCount, jobCount, applications, matchStats] = await Promise.all([
      ResumeModel.countDocuments({ user: userObjectId }),
      JobModel.countDocuments({ user: userObjectId, isArchived: false }),
      ApplicationModel.find({ user: userObjectId }),
      MatchAnalysisModel.aggregate([
        { $match: { user: userObjectId } },
        { $group: { _id: null, avgScore: { $avg: '$matchScore' } } },
      ]),
    ]);

    const stageCounts: Record<string, number> = {
      [ApplicationStage.WISHLIST]: 0,
      [ApplicationStage.APPLIED]: 0,
      [ApplicationStage.SCREENING]: 0,
      [ApplicationStage.INTERVIEW]: 0,
      [ApplicationStage.OFFER]: 0,
      [ApplicationStage.REJECTED]: 0,
    };

    applications.forEach((app) => {
      if (stageCounts[app.stage] !== undefined) {
        stageCounts[app.stage]++;
      }
    });

    const totalApps = applications.length;
    const offers = stageCounts[ApplicationStage.OFFER] || 0;
    const interviews = stageCounts[ApplicationStage.INTERVIEW] || 0;

    const conversionRate = totalApps > 0 ? parseFloat(((offers / totalApps) * 100).toFixed(1)) : 0;
    const interviewRate = totalApps > 0 ? parseFloat(((interviews / totalApps) * 100).toFixed(1)) : 0;

    const avgScore = matchStats.length > 0 ? Math.round(matchStats[0].avgScore) : 0;

    return {
      totalResumes: resumeCount,
      totalJobsTracked: jobCount,
      applicationsByStage: stageCounts,
      averageMatchScore: avgScore,
      conversionRate,
      interviewRate,
      recentActivity: [],
    };
  }
}