import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma} from "@prismaGenerated/client";


const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  await prisma.productOnSale.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.seller.deleteMany({});
  
  const seller1 = await prisma.seller.create({
    data: {
      name: "CompuMundo",
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
      ClerkUserId: "user_3EXu6xpTDNsXy8898piNAyHxgNQ",
    },
  });
  const seller2 = await prisma.seller.create({
    data: {
      name: "TechHub",
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
      ClerkUserId: "user_3EXuD6o8wEumE6m152BeCPrjNd7",
    },
  });

  const seller3 = await prisma.seller.create({
    data: {
      name: "Juan Perez",
      CUIT: "30-59403294-3",
      email: "seller2+clerk_test@example.com",
      phoneNumber: "3454333436364",
      address: "345 Oak St, City, Country",
      startOfActivities: new Date("2023-06-15"),
      VATCondition: "Monotributista",
    },
  });


  const product1 = await prisma.product.create({
    data: {
        name: "Producto 1",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 1",
        model: "Modelo 1",
        price: new Prisma.Decimal(19.99),
        stock: 100,
        description: "Descripción del Producto 1",
        specs : "Especificaciones para el Producto 1",
        warranty : "Garantía para el Producto 1",
        image : "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });
  const product2 = await prisma.product.create({
    data: {
        name: "Producto 2",
        seller:{
            connect : { id: seller2.id }
        },
        brand: "Marca 2",
        model: "Modelo 2",
        price: new Prisma.Decimal(29.99),
        stock: 50, 
        description: "Descripción del Producto 2",
        specs : "Especificaciones para el Producto 2",
        warranty : "Garantía para el Producto 2",
        image : "https://images.unsplash.com/photo-1602837385569-08ac19ec83af?q=80&w=326&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });
  const product3 = await prisma.product.create({
    data: {
        name: "Producto 3",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 1",
        model: "Modelo 3",
        price: new Prisma.Decimal(39.99),
        stock: 25,
        description: "Descripción del Producto 3",
        specs : "Especificaciones para el Producto 3",
        warranty : "Garantía para el Producto 3",
        image : "https://images.unsplash.com/photo-1591238372408-8b98667c0460?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product4 = await prisma.product.create({
    data: {
        name: "Producto 4",
        seller:{
            connect : { id: seller2.id }
        },
        brand: "Marca 2",
        model: "Modelo 4",
        price: new Prisma.Decimal(49.99),
        stock: 10,
        description: "Descripción del Producto 4",
        specs : "Especificaciones para el Producto 4",
        warranty : "Garantía para el Producto 4",
        image : "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product5 = await prisma.product.create({
    data: {
        name: "Producto 5",
        seller:{
            connect : { id: seller3.id }
        },
        brand: "Marca 3",
        model: "Modelo 5",
        price: new Prisma.Decimal(59.99),
        stock: 5,
        description: "Descripción del Producto 5",
        specs : "Especificaciones para el Producto 5",
        warranty : "Garantía para el Producto 5",
        image : "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product6 = await prisma.product.create({
    data: {
        name: "Producto 6",
        seller:{
            connect : { id: seller3.id }
        },
        brand: "Marca 3",
        model: "Modelo 6",
        price: new Prisma.Decimal(69.99),
        stock: 2,
        description: "Descripción del Producto 6",
        specs : "Especificaciones para el Producto 6",
        warranty : "Garantía para el Producto 6",
        image : "https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product7 = await prisma.product.create({
    data: {
        name: "Producto 7",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 1",
        model: "Modelo 7",
        price: new Prisma.Decimal(79.99),
        stock: 0,
        description: "Descripción del Producto 7",
        specs : "Especificaciones para el Producto 7",
        warranty : "Garantía para el Producto 7",
        image : "https://images.unsplash.com/photo-1618209076877-3b577b275eef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product8 = await prisma.product.create({
    data: {
        name: "Producto 8",
        seller:{
            connect : { id: seller2.id }
        },
        brand: "Marca 2",
        model: "Modelo 8",
        price: new Prisma.Decimal(89.99),
        stock: 15,
        description: "Descripción del Producto 8",
        specs : "Especificaciones para el Producto 8",
        warranty : "Garantía para el Producto 8",
        image : "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=901&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product9 = await prisma.product.create({
    data: {
        name: "Producto 9",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 3",
        model: "Modelo 9",
        price: new Prisma.Decimal(99.99),
        stock: 20,
        description: "Descripción del Producto 9",
        specs : "Especificaciones para el Producto 9",
        warranty : "Garantía para el Producto 9",
        image : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product10 = await prisma.product.create({
    data: {
        name: "Producto 10",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 1",
        model: "Modelo 10",
        price: new Prisma.Decimal(109.99),
        stock: 30,
        description: "Descripción del Producto 10",
        specs : "Especificaciones para el Producto 10",
        warranty : "Garantía para el Producto 10",
        image : "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product11 = await prisma.product.create({
    data: {
        name: "Producto 11",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 1",
        model: "Modelo 11",
        price: new Prisma.Decimal(119.99),
        stock: 25,
        description: "Descripción del Producto 11",
        specs : "Especificaciones para el Producto 11",
        warranty : "Garantía para el Producto 11",
        image : "https://images.unsplash.com/photo-1592919933511-ea9d487c85e4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product12 = await prisma.product.create({
    data: {
        name: "Producto 12",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 2",
        model: "Modelo 12",
        price: new Prisma.Decimal(129.99),
        stock: 10,
        description: "Descripción del Producto 12",
        specs : "Especificaciones para el Producto 12",
        warranty : "Garantía para el Producto 12",
        image : "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product13 = await prisma.product.create({
    data: {
        name: "Producto 13",
        seller:{
            connect : { id: seller1.id }
        },
        brand: "Marca 3",
        model: "Modelo 13",
        price: new Prisma.Decimal(139.99),
        stock: 5,
        description: "Descripción del Producto 13",
        specs : "Especificaciones para el Producto 13",
        warranty : "Garantía para el Producto 13",
        image : "https://images.unsplash.com/photo-1555617778-02518510b9fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  });

  const product14 = await prisma.product.create({
    data: {
      name: "Producto 14",
      seller: {
        connect: { id: seller1.id },
      },
      brand: "Marca 1",
      model: "Modelo 14",
      price: new Prisma.Decimal(149.99),
      stock: 0,
      description: "Descripción del Producto 14",
      specs: "Especificaciones para el Producto 14",
      warranty: "Garantía para el Producto 14",
      image: "https://images.unsplash.com/photo-1555618565-9f2b0323a10d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGhhcmR3YXJlfGVufDB8fDB8fHww",
    },
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
  const sale3 = await createSale({
    sellerId: seller3.id,
    price: parseFloat(product5.price.toString()) + 2*parseFloat(product6.price.toString()),
    date: new Date("2022-10-11T09:30:00.000Z"),
    productIds: [product5.id, product6.id, product6.id],
  });
  const sale4 = await createSale({
    sellerId: seller1.id,
    price: parseFloat(product1.price.toString()) + parseFloat(product3.price.toString()) + parseFloat(product7.price.toString()),
    date: new Date("2023-11-20T15:45:00.000Z"),
    productIds: [product1.id, product3.id, product7.id],
  });
  const sale5 = await createSale({
    sellerId: seller2.id,
    price: 4*parseFloat(product4.price.toString()) + parseFloat(product8.price.toString()),
    date: new Date("2024-10-11T10:00:00.000Z"),
    productIds: [product4.id, product4.id, product4.id, product4.id, product8.id],
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