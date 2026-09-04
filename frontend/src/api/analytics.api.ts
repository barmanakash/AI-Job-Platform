// frontend/src/api/analytics.api.ts
import axiosClient from './axiosClient.ts';

export interface DashboardMetrics {
  totalResumes: number;
  totalJobsTracked: number;
  applicationsByStage: Record<string, number>;
  averageMatchScore: number;
  conversionRate: number;
  interviewRate: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await axiosClient.get<{ success: boolean; data: DashboardMetrics }>('/analytics/metrics');
  return response.data.data;
};