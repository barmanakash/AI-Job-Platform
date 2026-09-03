// backend/src/validators/interview.validator.ts
import { z } from 'zod';

export const generateInterviewPrepSchema = z.object({
  body: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID'),
  }),
});