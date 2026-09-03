// backend/src/models/Resume.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IResumeSection {
  title: string; // e.g. "Work Experience", "Projects", "Skills"
  content: string; // Markdown or raw formatted text
}

export interface IResumeVersion {
  versionNumber: number;
  title: string;
  rawText: string;
  sections: IResumeSection[];
  createdAt: Date;
}

export interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  isDefault: boolean;
  fileUrl?: string;
  fileType?: 'pdf' | 'docx' | 'manual';
  rawText: string;
  sections: IResumeSection[];
  versions: IResumeVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSectionSchema = new Schema<IResumeSection>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const ResumeVersionSchema = new Schema<IResumeVersion>({
  versionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  rawText: { type: String, required: true },
  sections: [ResumeSectionSchema],
  createdAt: { type: Date, default: Date.now },
});

const ResumeSchema = new Schema<IResume>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    fileUrl: { type: String },
    fileType: { type: String, enum: ['pdf', 'docx', 'manual'], default: 'manual' },
    rawText: { type: String, required: true },
    sections: [ResumeSectionSchema],
    versions: [ResumeVersionSchema],
  },
  { timestamps: true }
);

ResumeSchema.pre('save', function (next) {
  if (this.isModified('rawText') && !this.isNew) {
    const nextVersion = this.versions.length + 1;
    this.versions.push({
      versionNumber: nextVersion,
      title: `${this.title} (v${nextVersion})`,
      rawText: this.rawText,
      sections: this.sections,
      createdAt: new Date(),
    });
  }
  next();
});

export const ResumeModel = model<IResume>('Resume', ResumeSchema);