// backend/src/validators/coverLetter.validator.ts
import { z } from 'zod';
import { CoverLetterTone } from '../models/CoverLetter';

export const generateCoverLetterSchema = z.object({
  body: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID'),
    hiringManagerName: z.string().optional(),
    tone: z.nativeEnum(CoverLetterTone).default(CoverLetterTone.PROFESSIONAL),
  }),
});