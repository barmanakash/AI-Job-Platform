// backend/src/models/CoverLetter.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum CoverLetterTone {
  PROFESSIONAL = 'PROFESSIONAL',
  FRIENDLY = 'FRIENDLY',
  CONCISE = 'CONCISE',
  CONFIDENT = 'CONFIDENT',
}

export interface ICoverLetter extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  resume: Types.ObjectId;
  companyName: string;
  hiringManagerName?: string;
  tone: CoverLetterTone;
  content: string;
  keyHighlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    companyName: { type: String, required: true, trim: true },
    hiringManagerName: { type: String, trim: true },
    tone: {
      type: String,
      enum: Object.values(CoverLetterTone),
      default: CoverLetterTone.PROFESSIONAL,
    },
    content: { type: String, required: true },
    keyHighlights: [{ type: String }],
  },
  { timestamps: true }
);

export const CoverLetterModel = model<ICoverLetter>('CoverLetter', CoverLetterSchema);