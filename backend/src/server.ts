// backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase, stopDatabase } from './config/database';
import { initAIWorker } from './queues/aiProcessing.worker';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await initAIWorker();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const handleShutdown = async () => {
    console.log('Received termination signal. Shutting down gracefully...');
    server.close(async () => {
      await stopDatabase();
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();