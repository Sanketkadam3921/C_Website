// Prisma Client - Make sure to run 'npx prisma generate' after setting up the database
let prisma;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} catch (error) {
  console.warn('Prisma Client not available. Make sure to run: npx prisma generate');
  prisma = null;
}

module.exports = prisma;

