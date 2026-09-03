// backend/src/models/Application.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum ApplicationStage {
  WISHLIST = 'WISHLIST',
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

export interface IApplicationActivity {
  stage: ApplicationStage;
  date: Date;
  notes?: string;
}

export interface IApplication extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  resume?: Types.ObjectId;
  stage: ApplicationStage;
  positionOrder: number; // Used for ordering cards within a Kanban column
  appliedDate?: Date;
  followUpDate?: Date;
  notes?: string;
  activityLog: IApplicationActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationActivitySchema = new Schema<IApplicationActivity>({
  stage: { type: String, enum: Object.values(ApplicationStage), required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

const ApplicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume' },
    stage: {
      type: String,
      enum: Object.values(ApplicationStage),
      default: ApplicationStage.WISHLIST,
      index: true,
    },
    positionOrder: { type: Number, default: 0 },
    appliedDate: { type: Date },
    followUpDate: { type: Date },
    notes: { type: String, default: '' },
    activityLog: [ApplicationActivitySchema],
  },
  { timestamps: true }
);

ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

export const ApplicationModel = model<IApplication>('Application', ApplicationSchema);