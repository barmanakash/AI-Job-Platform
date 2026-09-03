// backend/src/types/domain.ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum ApplicationStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  TECHNICAL_ROUND = 'TECHNICAL_ROUND',
  FINAL_ROUND = 'FINAL_ROUND',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface IAIScoreBreakdown {
  score: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  skillAnalysis: Record<string, number>;
  recommendations: string[];
  sectionScores: Record<string, number>;
}