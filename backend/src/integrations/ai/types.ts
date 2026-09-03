// backend/src/integrations/ai/types.ts
import { IAIScoreBreakdown } from '../../types/domain';

export interface MatchAnalysisResult {
  matchScore: number;
  technicalMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface IAIServiceProvider {
  analyzeResume(resumeText: string): Promise<IAIScoreBreakdown>;
  analyzeJob(jobDescription: string): Promise<Record<string, unknown>>;
  matchResumeToJob(resumeText: string, jobDescription: string): Promise<MatchAnalysisResult>;
  generateCoverLetter(params: { resumeText: string; jobDescription: string; tone: string; company: string }): Promise<string>;
}