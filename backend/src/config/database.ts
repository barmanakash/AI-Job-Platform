// backend/src/config/database.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryMongoServer: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri && process.env.NODE_ENV !== 'production') {
      memoryMongoServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryMongoServer.getUri());
      console.log('Successfully connected to in-memory MongoDB Database.');
      return;
    }

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined for production environment.');
    }

    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB Database.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const stopDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }

  if (memoryMongoServer) {
    await memoryMongoServer.stop();
    memoryMongoServer = null;
  }
};