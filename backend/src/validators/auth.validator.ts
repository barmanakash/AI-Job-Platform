// backend/src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedInUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    gitHubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    professionalTitle: z.string().min(2, 'Professional title is required'),
    yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
    skills: z.array(z.string()),
    preferredJobTitle: z.string().min(2, 'Preferred job title is required'),
    preferredLocation: z.string().optional(),
    remotePreference: z.enum(['REMOTE', 'HYBRID', 'ONSITE', 'ANY']),
    salaryExpectation: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().default('USD'),
      })
      .optional(),
  }),
});