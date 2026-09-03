// backend/src/models/SkillGap.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum PriorityLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface ISkillGapItem {
  skill: string;
  category: string; // e.g., "Frontend", "Backend", "DevOps"
  priority: PriorityLevel;
  reason: string;
}

export interface IRoadmapStep {
  stepNumber: number;
  topic: string;
  recommendedAction: string;
  estimatedHours: number;
  suggestedResources: string[];
}

export interface ISkillGap extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  resume: Types.ObjectId;
  matchingSkills: string[];
  missingSkills: ISkillGapItem[];
  roadmap: IRoadmapStep[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillGapItemSchema = new Schema<ISkillGapItem>({
  skill: { type: String, required: true },
  category: { type: String, default: 'General' },
  priority: { type: String, enum: Object.values(PriorityLevel), required: true },
  reason: { type: String, required: true },
});

const RoadmapStepSchema = new Schema<IRoadmapStep>({
  stepNumber: { type: Number, required: true },
  topic: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  estimatedHours: { type: Number, required: true },
  suggestedResources: [{ type: String }],
});

const SkillGapSchema = new Schema<ISkillGap>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    matchingSkills: [{ type: String }],
    missingSkills: [SkillGapItemSchema],
    roadmap: [RoadmapStepSchema],
  },
  { timestamps: true }
);

SkillGapSchema.index({ user: 1, job: 1, resume: 1 }, { unique: true });

export const SkillGapModel = model<ISkillGap>('SkillGap', SkillGapSchema);