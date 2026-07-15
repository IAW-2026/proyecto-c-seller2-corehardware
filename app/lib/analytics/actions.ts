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
        select: {
            id: true,
            name: true,
            CUIT: true,
            email: true,
            phoneNumber: true,
            VATCondition: true,
            createdAt: true,
        },
    });
    return sellers;
}

export async function getSellerGrowthForRange(from: Date, to: Date) {
    const sellers = await prisma.seller.findMany({
        where: {
            isDeleted: false,
            createdAt: { gte: from, lte: to },
        },
        select: { createdAt: true },
    });

    // Agrupamos por día (YYYY-MM-DD) en JS, ya que el volumen de vendedores
    // es chico y no justifica un $queryRaw con DATE_TRUNC.
    const countsByDay = new Map<string, number>();
    for (const s of sellers) {
        const dayKey = s.createdAt.toISOString().slice(0, 10); // "2026-07-15"
        countsByDay.set(dayKey, (countsByDay.get(dayKey) ?? 0) + 1);
    }

    // Completamos con 0 los días sin altas, para que el gráfico no tenga huecos.
    const result: { fecha: string; cantidad: number }[] = [];
    const cursor = new Date(from);
    while (cursor <= to) {
        const dayKey = cursor.toISOString().slice(0, 10);
        result.push({ fecha: dayKey, cantidad: countsByDay.get(dayKey) ?? 0 });
        cursor.setDate(cursor.getDate() + 1);
    }

    return result;
}