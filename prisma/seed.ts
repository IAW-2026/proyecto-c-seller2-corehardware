import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma} from "@prismaGenerated/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const product1 = await prisma.product.create({
    data: {
        name: "Product 1",
        seller:{
            create : { }
        },
        brand: "Brand 1",
        model: "Model 1",
        price: new Prisma.Decimal(19.99),
        stock: 100, 
    }
  });
  const product2 = await prisma.product.create({
    data: {
        name: "Product 2",
        seller:{
            create : { }
        },
        brand: "Brand 2",
        model: "Model 2",
        price: new Prisma.Decimal(29.99),
        stock: 50, 
    }
  });
  const product3 = await prisma.product.create({
    data: {
        name: "Product 3",
        seller:{
            create : { }
        },
        brand: "Brand 1",
        model: "Model 3",
        price: new Prisma.Decimal(39.99),
        stock: 25,
    }
  });    
  console.log({ product1, product2, product3 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });