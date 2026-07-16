import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Mapeo: ID actual (generado por el seed de Seller) -> ID viejo
// (hardcodeado en el seed de Buyer, que otras bases ya referencian por FK "de texto plano").
const SELLER_ID_MAP: Record<string, string> = {
  "cmrlmprbf00002otv2u4r0o7e": "cmqsqife700003gwvusoch7hn", // CompuMundo
  "cmrlmprkp00012otvq6p37wvx": "cmqsqifro00013gwv1be68fk2", // TechHub
  "cmrlmprtv00022otvs0eikom5": "cmqsqig0o00023gwvaaq128mq", // Juan Perez
};

const PRODUCT_ID_MAP: Record<string, string> = {
  "cmrlmps8000032otvl01f5zwq": "cmqsqige700033gwvgrck0hve", // Producto 1
  "cmrlmpswo00042otvhwbxal83": "cmqsqigzf00043gwvqiuls5ud", // Producto 2
  "cmrlmptjc00052otvg1qtgcn4": "cmqsqihki00053gwvva3dkwj3", // Producto 3
  "cmrlmpukq00062otvg111fdj0": "cmqsqii5m00063gwvy2veckqs", // Producto 4
  "cmrlmpv7e00072otvq0rbsqwg": "cmqsqiiqo00073gwvguro81as", // Producto 5
  "cmrlmpvty00082otvl1vvr8tb": "cmqsqijbt00083gwv9thkmebw", // Producto 6
  "cmrlmpxhp000a2otv2o9ndih5": "cmqsqikz8000a3gwvbw7d9zjh", // Producto 8
  "cmrlmpyjq000b2otvi7nd3xpu": "cmqsqilkh000b3gwv5n997e4f", // Producto 9
  "cmrlmpzbl000c2otvknx5akqc": "cmqsqim5k000c3gwvsxq3m8cn", // Producto 10
  // Producto 7 y Productos 11-14 no están referenciados por el seed de Buyer, se dejan como están.
};

type FkRow = { conname: string; conrelid: string };

async function getFkConstraints(): Promise<FkRow[]> {
  return prisma.$queryRawUnsafe<FkRow[]>(`
    SELECT conname, conrelid::regclass::text AS conrelid
    FROM pg_constraint
    WHERE contype = 'f'
      AND conrelid::regclass::text IN ('"Product"', '"Sale"', '"ProductOnSale"')
  `);
}

async function setDeferrable(fks: FkRow[], deferrable: boolean) {
  for (const fk of fks) {
    const clause = deferrable ? "DEFERRABLE INITIALLY DEFERRED" : "NOT DEFERRABLE";
    // Cada ALTER corre como su propia transacción implícita (fuera de $transaction),
    // por eso NO se puede mezclar con los UPDATE en el mismo bloque transaccional.
    await prisma.$executeRawUnsafe(
      `ALTER TABLE ${fk.conrelid} ALTER CONSTRAINT "${fk.conname}" ${clause}`
    );
  }
}

async function main() {
  const fks = await getFkConstraints();
  console.log(
    "FKs detectadas:",
    fks.map((f) => `${f.conrelid}.${f.conname}`)
  );

  // Paso 1: hacer las FKs deferrable. Transacción propia, separada de los UPDATEs.
  console.log("⏳ Paso 1/3: marcando FKs como DEFERRABLE...");
  await setDeferrable(fks, true);

  try {
    // Paso 2: transacción de datos. Acá SET CONSTRAINTS DEFERRED ya es válido,
    // porque el cambio de deferrability del paso 1 ya quedó confirmado.
    console.log("⏳ Paso 2/3: aplicando los cambios de IDs...");
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET CONSTRAINTS ALL DEFERRED`);

        // Seller.id -> ID viejo
        for (const [currentId, oldId] of Object.entries(SELLER_ID_MAP)) {
          await tx.$executeRawUnsafe(
            `UPDATE "Seller" SET id = $1 WHERE id = $2`,
            oldId,
            currentId
          );
        }

        // Product.sellerId -> ID viejo del seller correspondiente
        for (const [currentId, oldId] of Object.entries(SELLER_ID_MAP)) {
          await tx.$executeRawUnsafe(
            `UPDATE "Product" SET "sellerId" = $1 WHERE "sellerId" = $2`,
            oldId,
            currentId
          );
        }

        // Sale.sellerId -> ID viejo del seller correspondiente
        for (const [currentId, oldId] of Object.entries(SELLER_ID_MAP)) {
          await tx.$executeRawUnsafe(
            `UPDATE "Sale" SET "sellerId" = $1 WHERE "sellerId" = $2`,
            oldId,
            currentId
          );
        }

        // ProductOnSale.productId -> ID viejo (ANTES de tocar Product.id)
        for (const [currentId, oldId] of Object.entries(PRODUCT_ID_MAP)) {
          await tx.$executeRawUnsafe(
            `UPDATE "ProductOnSale" SET "productId" = $1 WHERE "productId" = $2`,
            oldId,
            currentId
          );
        }

        // Product.id -> ID viejo
        for (const [currentId, oldId] of Object.entries(PRODUCT_ID_MAP)) {
          await tx.$executeRawUnsafe(
            `UPDATE "Product" SET id = $1 WHERE id = $2`,
            oldId,
            currentId
          );
        }
      },
      { timeout: 20000 }
    );

    console.log("✅ IDs sincronizados con los valores viejos del seed de Buyer.");
  } finally {
    // Paso 3: revertir SIEMPRE las FKs a su estado original, haya salido bien o mal el paso 2.
    console.log("⏳ Paso 3/3: revirtiendo FKs a NOT DEFERRABLE...");
    await setDeferrable(fks, false);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());