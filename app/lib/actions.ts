'use server';

import { Prisma, PrismaClient } from "@prismaGenerated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";
import { revalidatePath } from 'next/cache';

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
    errors: string[] | null;
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


type CreateProductRequestType = {
    name: string;
    sellerId?: number;
    brand: string;
    model: string;
    price: number;
    stock: number;
}

export async function createProduct(validatedData: CreateProductRequestType) {
  const {sellerId, price, ...restData} = validatedData;
  const product = await prisma.product.create( 
    { data: {
        ...restData,
        seller: validatedData.sellerId ?
            { 
                connect: { id: validatedData.sellerId } 
            }:
            {
                create : { }
            },
        price: new Prisma.Decimal(validatedData.price),
   }});
   revalidatePath("/products");
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
    revalidatePath("/products");
    return prismaProductToProduct(product);
}

export async function deleteProduct(data: z.infer<typeof deleteProductSchema>) {
    const validatedData = deleteProductSchema.parse(data);
    const { id } = validatedData;
    const product = await prisma.product.update({
        where: { id },
        data: { isDeleted: true },
    });
    revalidatePath("/products");
    return prismaProductToProduct(product);
}

export async function getProducts() {
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
    });
    return products.map(prismaProductToProduct);
}