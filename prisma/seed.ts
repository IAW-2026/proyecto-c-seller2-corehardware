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
      name: "seller1",
      CUIT: "20-12345678-9",
      email: "seller1+clerk_test@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St, City, Country",
      startOfActivities: new Date("2020-01-01"),
      VATCondition: "Responsable Inscripto",
    },
  });
  await prisma.seller.update({
    where: { id: seller1.id },
    data: {
      ClerkUserId: "user_3EV7FR0knYFOxA7XZ58CZcbJzEP",
    },
  });
  const seller2 = await prisma.seller.create({
    data: {
      name: "seller2",
      CUIT: "27-98765432-1",
      email: "seller2+clerk_test@example.com",
      phoneNumber: "0987654321",
      address: "456 Elm St, City, Country",
      startOfActivities: new Date("2021-06-15"),
      VATCondition: "Monotributista",
    },
  });
  await prisma.seller.update({
    where: { id: seller2.id },
    data: {
      ClerkUserId: "user_3EV7PvV3NYMAOYWp9CMBwKvymTZ",
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
        description: "Description for Product 1",
        specs : "Specs for Product 1",
        warranty : "Warranty for Product 1",
        image : "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        description: "Description for Product 2",
        specs : "Specs for Product 2",
        warranty : "Warranty for Product 2",
        image : "https://images.unsplash.com/photo-1602837385569-08ac19ec83af?q=80&w=326&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        description: "Description for Product 3",
        specs : "Specs for Product 3",
        warranty : "Warranty for Product 3",
        image : "https://images.unsplash.com/photo-1591238372408-8b98667c0460?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });
  const product4 = await prisma.product.create({
    data: {
        name: "Product 4",
        seller:{
            connect : { id: seller2.id }
        },
        brand: "Brand 2",
        model: "Model 4",
        price: new Prisma.Decimal(49.99),
        stock: 10,
        description: "Description for Product 4",
        specs : "Specs for Product 4",
        warranty : "Warranty for Product 4",
        image : "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });
  const sale1 = await createSale({
    sellerId: seller1.id,
    price: 2* parseFloat(product1.price.toString()) + parseFloat(product3.price.toString()),
    date: new Date("2023-12-01T04:18:32.000Z"),
    productIds: [product1.id, product1.id, product3.id],
  });
  const sale2 = await createSale({
    sellerId: seller2.id,
    price: parseFloat(product2.price.toString()) + 3*parseFloat(product4.price.toString()),    
    date: new Date("2023-12-10T12:55:31.000Z"),
    productIds: [product2.id, product4.id, product4.id, product4.id],
  });
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



async function createSale( validatedData: { sellerId: number, price: number, date: Date, productIds: number[]}){
    const sale = await prisma.sale.create({
        data:{
            date: validatedData.date,
            totalPrice: validatedData.price,
            seller:{
                connect: { id: validatedData.sellerId}
            }
        }
    });
    await Promise.all(validatedData.productIds.map( (id) => addProductToSale(sale.id,id)));
    return sale;
}

async function addProductToSale(saleId:number, productId:number){
  const productOnSale = await prisma.productOnSale.upsert({
        where:{
            saleId_productId:{
                saleId:saleId,
                productId:productId,
            }
        },
        update:{
            productAmount : {
                increment:1
            }
        },
        create: {
            saleId:saleId,
            productId:productId,
            productAmount:1
        }
    });
}