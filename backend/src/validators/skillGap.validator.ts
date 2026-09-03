// backend/src/validators/skillGap.validator.ts
import { z } from 'zod';

export const analyzeSkillGapSchema = z.object({
  body: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID'),
  }),
});