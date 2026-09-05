// backend/src/queues/aiProcessing.worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { QUEUE_NAMES, AIJobType, AIJobPayload } from './queue.constants';
import { JobAIService } from '../services/jobAI.service';
import { MatchAIService } from '../services/matchAI.service';
import { SkillGapAIService } from '../services/skillGapAI.service';
import { CoverLetterAIService } from '../services/coverLetterAI.service';

export const initAIWorker = async () => {
  try {
    await redisConnection.ping();
  } catch {
    console.warn('Redis is unavailable; AI worker is disabled for this session.');
    return null;
  }

  const worker = new Worker<AIJobPayload>(
    QUEUE_NAMES.AI_PROCESSING,
    async (job: Job<AIJobPayload>) => {
      const { jobType, userId, data } = job.data;
      console.log(`Processing asynchronous AI Job [${job.id}]: ${jobType}`);

      switch (jobType) {
        case AIJobType.ANALYZE_JOB:
          return await JobAIService.analyzeJobDescription(data.jobId, userId);

        case AIJobType.EVALUATE_MATCH:
          return await MatchAIService.evaluateMatch(data.resumeId, data.jobId, userId);

        case AIJobType.GENERATE_SKILL_GAP:
          return await SkillGapAIService.generateSkillGapMatrix(data.jobId, data.resumeId, userId);

        case AIJobType.GENERATE_COVER_LETTER:
          return await CoverLetterAIService.generateCoverLetter({
            jobId: data.jobId,
            resumeId: data.resumeId,
            userId,
            hiringManagerName: data.hiringManagerName,
            tone: data.tone,
          });

        default:
          throw new Error(`Unsupported AI Job Type: ${jobType}`);
      }
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} of type ${job.data.jobType} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
  });

  return worker;
};