// backend/src/models/JobAnalysis.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IJobAnalysis extends Document {
  job: Types.ObjectId;
  user: Types.ObjectId;
  extractedRequiredSkills: string[];
  extractedPreferredSkills: string[];
  responsibilities: string[];
  experienceLevel: string; // e.g., "Senior (5+ years)"
  educationRequirements: string[];
  importantKeywords: string[];
  technologies: string[];
  softSkills: string[];
  createdAt: Date;
}

const JobAnalysisSchema = new Schema<IJobAnalysis>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    extractedRequiredSkills: [{ type: String }],
    extractedPreferredSkills: [{ type: String }],
    responsibilities: [{ type: String }],
    experienceLevel: { type: String, required: true },
    educationRequirements: [{ type: String }],
    importantKeywords: [{ type: String }],
    technologies: [{ type: String }],
    softSkills: [{ type: String }],
  },
  { timestamps: true }
);

export const JobAnalysisModel = model<IJobAnalysis>('JobAnalysis', JobAnalysisSchema);