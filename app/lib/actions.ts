'use server';

import { Prisma, PrismaClient } from "@prismaGenerated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

export type Product = {
    id: number;
    sellerId: number;
    name: string;
    brand: string;
    model: string;
    price: string;
    stock: number;
    isDeleted: boolean;
};

export type State = {
    product: Product | null;
    loading: boolean;
    error: string | null;
};

function prismaProductToProduct(prismaProduct: Prisma.ProductModel): Product {
    return {
        id: prismaProduct.id,
        sellerId: prismaProduct.sellerId,
        name: prismaProduct.name,
        brand: prismaProduct.brand,
        model: prismaProduct.model,
        price: prismaProduct.price.toString(),
        stock: prismaProduct.stock,
        isDeleted: prismaProduct.isDeleted,
    };
}

const connectionString = `${process.env.DATABASE_URL}`;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
 
const createProductSchema = z.object({
  name: z.string(),
  sellerId: z.coerce.number().int().positive({ message: "Seller ID must be a positive integer" }).optional(),
  brand: z.string(),
  model: z.string(),
  price: z.coerce.number().gt(0, { message: "Price must be greater than 0" }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
});


const editProductSchema = z.object({
    id: z.coerce.number().int().positive({ message: "Product ID must be a positive integer" }),
    name: z.string().optional(),
    sellerId: z.coerce.number().int().positive({ message: "Seller ID must be a positive integer" }).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    price: z.coerce.number().gt(0, { message: "Price must be greater than 0" }).optional(),
    stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }).optional(),
});

const deleteProductSchema = z.object({ id: z.coerce.number().int().positive({ message: "Product ID must be a positive integer" }) });


// Remember to only handle seller differently, and just pass the rest of the data on the full version
export async function createProduct(data: z.infer<typeof createProductSchema>) {
  const validatedData = createProductSchema.parse(data);
  const product = await prisma.product.create( 
    { data: {
        name: validatedData.name,
        seller: validatedData.sellerId ?
            { 
                connect: { id: validatedData.sellerId } 
            }:
            {
                create : { }
            },
        brand: validatedData.brand,
        model: validatedData.model,
        price: new Prisma.Decimal(validatedData.price),
        stock: validatedData.stock,
   }});
  return prismaProductToProduct(product);
}

export async function editProduct(data: z.infer<typeof editProductSchema>) {
    const validatedData = editProductSchema.parse(data);
    const { id,price, ...updateData } = validatedData;
    const newPrice = price ? new Prisma.Decimal(price) : undefined;
    const product = await prisma.product.update({
        where: { id },
        data: {
            ...updateData,
            price: newPrice,
        },
    });
    return prismaProductToProduct(product);
}

export async function deleteProduct(data: z.infer<typeof deleteProductSchema>) {
    const validatedData = deleteProductSchema.parse(data);
    const { id } = validatedData;
    const product = await prisma.product.update({
        where: { id },
        data: { isDeleted: true },
    });
    return prismaProductToProduct(product);
}

export async function getProducts() {
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
    });
    return products.map(prismaProductToProduct);
}