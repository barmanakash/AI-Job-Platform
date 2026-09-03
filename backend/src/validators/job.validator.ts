// backend/src/validators/job.validator.ts
import { z } from 'zod';
import { EmploymentType, WorkLocationType } from '../models/Job';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Job title is required'),
    company: z.string().min(2, 'Company name is required'),
    location: z.string().optional(),
    jobUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
    salary: z.string().optional(),
    employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
    workLocationType: z.nativeEnum(WorkLocationType).default(WorkLocationType.HYBRID),
    description: z.string().min(20, 'Job description must be at least 20 characters'),
    requiredSkills: z.array(z.string()).default([]),
    preferredSkills: z.array(z.string()).default([]),
    experienceRequired: z.string().optional(),
  }),
});

export const matchRequestSchema = z.object({
  body: z.object({
    resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID'),
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID'),
  }),
});