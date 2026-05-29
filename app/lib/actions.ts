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
    description: string;
    specs: string;
    warranty: string;
    imageUrl: string;
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
        description: prismaProduct.description,
        specs: prismaProduct.specs,
        warranty: prismaProduct.warranty,
        imageUrl: prismaProduct.image,
        price: prismaProduct.price.toString(),
        stock: prismaProduct.stock,
    };
}

const connectionString = `${process.env.DATABASE_URL}`;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});


type CreateProductRequestType = {
    name: string;
    sellerId: number;
    brand: string;
    model: string;
    price: number;
    stock: number;
    description: string;
    specs: string;
    warranty: string;
    image: string;
}

export async function createProduct(validatedData: CreateProductRequestType) {
  const {sellerId, price, ...restData} = validatedData;
  const product = await prisma.product.create( 
    { data: {
        ...restData,
        seller: { connect: { id: validatedData.sellerId } },
        price: new Prisma.Decimal(validatedData.price),
   }});
  revalidatePath("/products");
  return prismaProductToProduct(product);
}

type EditProductRequestType = {
    id: number,
    name?: string;
    sellerId?: number;
    brand?: string;
    model?: string;
    price?: number;
    stock?: number;
    description?: string;
    specs?: string;
    warranty?: string;
    image?: string;
}

export async function editProduct(validatedData: EditProductRequestType) {
    const { id,price, ...updateData } = validatedData;
    const newPrice = price ? new Prisma.Decimal(price) : undefined;
    const product = await prisma.product.update({
        where: { id, isDeleted:false },
        data: {
            ...updateData,
            price: newPrice,
        },
    });
    revalidatePath("/products");
    return prismaProductToProduct(product);
}

type DeleteProductRequestType = { id:number }

export async function deleteProduct(validatedData:DeleteProductRequestType) {
    const { id } = validatedData;
    const product = await prisma.product.update({
        where: { id, isDeleted:false },
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

type getProductsFilteredRequestType = {
    offset?:number,
    limit?:number,
    name?: string,
    brand?: string,
    seller?: string,
    hasStock?: boolean,
}

export async function getProductsFiltered(parameters:getProductsFilteredRequestType){
    const seller = await prisma.seller.findFirst({
        where : {name : parameters.seller}
    })
    const sellerId = (seller == null )? undefined : seller.id;
    const greaterThan = parameters.hasStock ? 0 : undefined;
    const filteredProducts = await prisma.product.findMany({
        where:{
            name : parameters.name,
            brand : parameters.brand,
            sellerId : sellerId,
            stock : {
                gte: greaterThan
            }
        },
        skip: parameters.offset,
        take: parameters.limit
    })
    return filteredProducts.map(prismaProductoToForeignProduct)
}

export async function getSellers() {
    const sellers = await prisma.seller.findMany({
        where: { isDeleted: false },
    });
}

type GetSellerRequestType = { id:number }

function prismaSellerToForeignSeller(prismaSeller:Prisma.SellerModel){
    return {
        id: prismaSeller.id,
        cuit: prismaSeller.CUIT,
        razon_social: prismaSeller.name,
        direccion: prismaSeller.address,
        mail: prismaSeller.email,
        celular: prismaSeller.phoneNumber,
        condicion_iva: prismaSeller.VATCondition
    }
}

export async function getSeller(validatedData:GetSellerRequestType){
    const seller = await prisma.seller.findUniqueOrThrow({
        where: { id: validatedData.id, isDeleted:false},
    });
    return prismaSellerToForeignSeller(seller);
}

type GetProductRequestType = { id: number }

async function prismaProductoToForeignProduct(prismaProduct:Prisma.ProductModel){
    const seller = await prisma.seller.findUniqueOrThrow({
        where: { id: prismaProduct.sellerId},
    });
    return{
        id: prismaProduct.id,
        nombre: prismaProduct.name,
        vendedor: seller.name,
        marca: prismaProduct.brand,
        modelo: prismaProduct.model,
        precio: prismaProduct.price.toNumber(),
        descripcion: prismaProduct.description,
        especificaciones: prismaProduct.specs,
        garantia: prismaProduct.warranty,
        imagen: prismaProduct.image,
        stock: prismaProduct.stock,
    }
}

export async function getProduct(validatedData:GetProductRequestType){
    const product = await prisma.product.findUniqueOrThrow({
        where: { id: validatedData.id, isDeleted:false},
    });
    return prismaProductoToForeignProduct(product);
}

export async function validateSellerId(sellerId:number) {
    return await prisma.seller.count({ where: { id:sellerId, isDeleted:false }}) > 0;    
}


