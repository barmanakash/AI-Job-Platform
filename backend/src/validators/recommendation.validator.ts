// backend/src/validators/recommendation.validator.ts
import { z } from 'zod';

export const getRecommendationsSchema = z.object({
  body: z.object({
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID'),
    limit: z.number().min(1).max(20).default(5),
  }),
});