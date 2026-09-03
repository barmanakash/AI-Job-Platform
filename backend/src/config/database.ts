// backend/src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_career_platform';
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB Database.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};