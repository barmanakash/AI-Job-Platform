// backend/src/models/InterviewPrep.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum QuestionCategory {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  CULTURE_FIT = 'CULTURE_FIT',
}

export interface IInterviewQuestion {
  question: string;
  category: QuestionCategory;
  idealAnswer: string;
  starFramework?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyTalkingPoints: string[];
}

export interface IInterviewPrep extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  resume: Types.ObjectId;
  questions: IInterviewQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>({
  question: { type: String, required: true },
  category: { type: String, enum: Object.values(QuestionCategory), required: true },
  idealAnswer: { type: String, required: true },
  starFramework: {
    situation: { type: String },
    task: { type: String },
    action: { type: String },
    result: { type: String },
  },
  keyTalkingPoints: [{ type: String }],
});

const InterviewPrepSchema = new Schema<IInterviewPrep>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    questions: [InterviewQuestionSchema],
  },
  { timestamps: true }
);

export const InterviewPrepModel = model<IInterviewPrep>('InterviewPrep', InterviewPrepSchema);