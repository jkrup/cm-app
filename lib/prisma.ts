// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare the global type to include prisma
declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Prevent multiple instances in development
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export { prisma };