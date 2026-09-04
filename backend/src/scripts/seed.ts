// backend/src/scripts/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_career_platform';

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('MongoDB database connection is unavailable');
    }

    // Clear existing collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    // 1. Seed User
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    const userResult = await db.collection('users').insertOne({
      name: 'Akash Barman',
      email: 'akash.dev@example.com',
      passwordHash: hashedPassword,
      role: 'USER',
      isVerified: true,
      createdAt: new Date(),
    });
    const userId = userResult.insertedId;

    // 2. Seed Resume
    const resumeResult = await db.collection('resumes').insertOne({
      userId,
      title: 'Full Stack Frontend Engineer Resume',
      parsedContent: {
        skills: ['React.js', 'Material UI', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
        experienceYears: 3,
        education: 'B.Tech IT',
      },
      atsScore: 88,
      createdAt: new Date(),
    });
    const resumeId = resumeResult.insertedId;

    // 3. Seed Job Description
    const jobResult = await db.collection('jobs').insertOne({
      userId,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Remote',
      rawText: 'Looking for a Senior Frontend Developer with expertise in React, TypeScript, Material UI, and REST API integration.',
      requiredSkills: ['React.js', 'TypeScript', 'Material UI', 'Redux Toolkit', 'REST APIs'],
      status: 'ACTIVE',
      createdAt: new Date(),
    });
    const jobId = jobResult.insertedId;

    // 4. Seed Kanban Application Stage
    await db.collection('applications').insertOne({
      userId,
      jobId,
      resumeId,
      companyName: 'TechCorp Solutions',
      jobTitle: 'Senior Frontend Developer',
      stage: 'APPLIED',
      notes: 'Applied directly on company portal.',
      updatedAt: new Date(),
    });

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed();