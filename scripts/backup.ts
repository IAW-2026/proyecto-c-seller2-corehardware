import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sellers = await prisma.seller.findMany();
  const products = await prisma.product.findMany();
  const sales = await prisma.sale.findMany();
  const productOnSales = await prisma.productOnSale.findMany();

  fs.writeFileSync(
    "backup.json",
    JSON.stringify({ sellers, products, sales, productOnSales }, null, 2)
  );
}

main().finally(() => prisma.$disconnect());