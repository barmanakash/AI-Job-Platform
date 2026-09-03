// backend/src/queues/aiProcessing.queue.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { QUEUE_NAMES, AIJobPayload } from './queue.constants';

export const aiProcessingQueue = new Queue<AIJobPayload>(QUEUE_NAMES.AI_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: 100,
  },
});

export const addAIJobToQueue = async (payload: AIJobPayload) => {
  return await aiProcessingQueue.add(payload.jobType, payload);
};