// backend/src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../types/domain';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    isVerified: { type: Boolean, default: false },
    refreshTokenHash: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);