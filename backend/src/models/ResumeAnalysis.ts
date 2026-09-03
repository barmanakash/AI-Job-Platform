// backend/src/models/ResumeAnalysis.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IResumeAnalysis extends Document {
  resume: Types.ObjectId;
  user: Types.ObjectId;
  score: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  skillAnalysis: {
    technical: string[];
    soft: string[];
  };
  recommendations: string[];
  sectionScores: {
    formatting: number;
    experience: number;
    impactMetrics: number;
    skills: number;
  };
  createdAt: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    score: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    skillAnalysis: {
      technical: [{ type: String }],
      soft: [{ type: String }],
    },
    recommendations: [{ type: String }],
    sectionScores: {
      formatting: { type: Number, required: true },
      experience: { type: Number, required: true },
      impactMetrics: { type: Number, required: true },
      skills: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const ResumeAnalysisModel = model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);