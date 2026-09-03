// backend/src/models/Profile.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  grade?: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface IProfile extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone?: string;
  location?: string;
  profilePhoto?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  professionalTitle: string;
  yearsOfExperience: number;
  skills: string[];
  preferredJobTitle: string;
  preferredLocation?: string;
  remotePreference: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  education: IEducation[];
  workExperience: IWorkExperience[];
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  grade: { type: String },
});

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, required: true },
  technologies: [{ type: String }],
});

const ProfileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    profilePhoto: { type: String },
    linkedInUrl: { type: String, trim: true },
    gitHubUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    professionalTitle: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    skills: [{ type: String, trim: true }],
    preferredJobTitle: { type: String, required: true, trim: true },
    preferredLocation: { type: String, trim: true },
    remotePreference: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ONSITE', 'ANY'],
      default: 'ANY',
    },
    salaryExpectation: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' },
    },
    education: [EducationSchema],
    workExperience: [WorkExperienceSchema],
  },
  { timestamps: true }
);

export const ProfileModel = model<IProfile>('Profile', ProfileSchema);