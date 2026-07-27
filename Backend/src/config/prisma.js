import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize the Prisma adapter for Postgres
// In Prisma v7, explicit driver adapters are required for SQL databases.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

// Instantiate the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
