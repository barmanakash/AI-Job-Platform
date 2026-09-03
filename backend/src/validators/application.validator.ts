// backend/src/validators/application.validator.ts
import { z } from 'zod';
import { ApplicationStage } from '../models/Application';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID').optional(),
    stage: z.nativeEnum(ApplicationStage).default(ApplicationStage.WISHLIST),
    appliedDate: z.string().datetime().optional(),
    followUpDate: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});

export const updateStageSchema = z.object({
  body: z.object({
    stage: z.nativeEnum(ApplicationStage),
    positionOrder: z.number().nonnegative(),
    notes: z.string().optional(),
  }),
});