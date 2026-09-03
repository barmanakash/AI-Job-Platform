// backend/src/queues/queue.constants.ts
export const QUEUE_NAMES = {
  AI_PROCESSING: 'ai-processing-queue',
};

export enum AIJobType {
  PARSE_RESUME = 'PARSE_RESUME',
  ANALYZE_JOB = 'ANALYZE_JOB',
  EVALUATE_MATCH = 'EVALUATE_MATCH',
  GENERATE_SKILL_GAP = 'GENERATE_SKILL_GAP',
  GENERATE_COVER_LETTER = 'GENERATE_COVER_LETTER',
}

export interface AIJobPayload {
  jobType: AIJobType;
  userId: string;
  data: Record<string, any>;
}