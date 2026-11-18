import app from './app.js';
import config from './config/env.js';
import prisma from './config/db.js';

const startServer = async () => {
  try {
    // Attempt DB connection check
    await prisma.$connect();
    console.log('Database connected successfully via Prisma');
  } catch (error) {
    console.warn('Warning: Database connection failed on startup. Please ensure MySQL is running and migrations have been executed.');
    console.warn('Error details:', error.message);
  }

  const server = app.listen(config.port, () => {
    console.log(`FoodBridge API Server running on port ${config.port} [${config.nodeEnv}]`);
    console.log(`Health endpoint: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\nShutting down server gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Database disconnected. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
