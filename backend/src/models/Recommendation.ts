// backend/src/models/Recommendation.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IRecommendedJob {
  job: Types.ObjectId;
  score: number; // 0-100 overall fit score
  reasoning: string;
  matchingSkillsCount: number;
  missingSkillsCount: number;
}

export interface IRecommendation extends Document {
  user: Types.ObjectId;
  resume: Types.ObjectId;
  recommendedJobs: IRecommendedJob[];
  createdAt: Date;
  updatedAt: Date;
}

const RecommendedJobSchema = new Schema<IRecommendedJob>({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  score: { type: Number, required: true },
  reasoning: { type: String, required: true },
  matchingSkillsCount: { type: Number, default: 0 },
  missingSkillsCount: { type: Number, default: 0 },
});

const RecommendationSchema = new Schema<IRecommendation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    recommendedJobs: [RecommendedJobSchema],
  },
  { timestamps: true }
);

RecommendationSchema.index({ user: 1, resume: 1 }, { unique: true });

export const RecommendationModel = model<IRecommendation>('Recommendation', RecommendationSchema);