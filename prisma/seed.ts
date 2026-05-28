import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma} from "@prismaGenerated/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const seller1 = await prisma.seller.create({
    data: {
      name: "Seller 1",
      CUIT: "20-12345678-9",
      email: "seller1@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St, City, Country",
      startOfActivities: new Date("2020-01-01"),
      VATCondition: "Responsable Inscripto",
    },
  });
  const seller2 = await prisma.seller.create({
    data: {
      name: "Seller 2",
      CUIT: "27-98765432-1",
      email: "seller2@example.com",
      phoneNumber: "0987654321",
      address: "456 Elm St, City, Country",
      startOfActivities: new Date("2021-06-15"),
      VATCondition: "Monotributista",
    },
  });

  const product1 = await prisma.product.create({
    data: {
        name: "Product 1",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Brand 1",
        model: "Model 1",
        price: new Prisma.Decimal(19.99),
        stock: 100,
        specs : "Specs for Product 1",
        warranty : "Warranty for Product 1",
        image : "https://example.com/product1.jpg",
    }
  });
  const product2 = await prisma.product.create({
    data: {
        name: "Product 2",
        seller:{
            connect : { id: seller2.id }
        },
        brand: "Brand 2",
        model: "Model 2",
        price: new Prisma.Decimal(29.99),
        stock: 50, 
        specs : "Specs for Product 2",
        warranty : "Warranty for Product 2",
        image : "https://example.com/product2.jpg",
    }
  });
  const product3 = await prisma.product.create({
    data: {
        name: "Product 3",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Brand 1",
        model: "Model 3",
        price: new Prisma.Decimal(39.99),
        stock: 25,
        specs : "Specs for Product 3",
        warranty : "Warranty for Product 3",
        image : "https://example.com/product3.jpg",
    }
  });    
  console.log({ seller1, seller2, product1, product2, product3 });
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