'use server';

import { PrismaClient } from "@prismaGenerated/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Mismo patrón singleton que ya usa el proyecto Analytics (lib/prisma.ts) —
// evita crear una nueva instancia (y agotar el pool de conexiones) en cada
// hot-reload durante desarrollo.
const globalForPrisma = globalThis as unknown as { prismaAnalytics?: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;

const prisma =
  globalForPrisma.prismaAnalytics ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAnalytics = prisma;
}

export async function getAllProductsForAnalytics() {
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, sellerId: true },
    });
    return products;
}

export async function getAllSellersForAnalytics() {
    const sellers = await prisma.seller.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true },
    });
    return sellers;
}