// backend/src/models/MatchAnalysis.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IMatchAnalysis extends Document {
  resume: Types.ObjectId;
  job: Types.ObjectId;
  user: Types.ObjectId;
  matchScore: number;
  technicalMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  potentialWeaknesses: string[];
  createdAt: Date;
}

const MatchAnalysisSchema = new Schema<IMatchAnalysis>(
  {
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    matchScore: { type: Number, required: true },
    technicalMatch: { type: Number, required: true },
    experienceMatch: { type: Number, required: true },
    educationMatch: { type: Number, required: true },
    keywordMatch: { type: Number, required: true },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendations: [{ type: String }],
    potentialWeaknesses: [{ type: String }],
  },
  { timestamps: true }
);

MatchAnalysisSchema.index({ resume: 1, job: 1, user: 1 });

export const MatchAnalysisModel = model<IMatchAnalysis>('MatchAnalysis', MatchAnalysisSchema);