// backend/src/models/Job.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum WorkLocationType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
}

export interface IJob extends Document {
  user: Types.ObjectId;
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  salary?: string;
  employmentType: EmploymentType;
  workLocationType: WorkLocationType;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    jobUrl: { type: String, trim: true },
    salary: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      default: EmploymentType.FULL_TIME,
    },
    workLocationType: {
      type: String,
      enum: Object.values(WorkLocationType),
      default: WorkLocationType.HYBRID,
    },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    experienceRequired: { type: String, trim: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobModel = model<IJob>('Job', JobSchema);