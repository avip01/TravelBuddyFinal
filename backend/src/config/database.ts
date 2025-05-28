import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to be reused
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  errorFormat: 'pretty',
});

// Connect to database on import
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('🗄️ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('🗄️ Database disconnected');
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

export { prisma, connectDatabase, disconnectDatabase }; 