'use server';

import { Prisma, PrismaClient } from "@prismaGenerated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from 'next/cache';
import { z } from "zod";
import { redirect } from "next/navigation";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { ValidationError } from "./errors";


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

export async function getProducts(limit:number, page:number, sellerID?:number) {
    const products = await prisma.product.findMany({
        where: { isDeleted: false, sellerId: sellerID },
        take: limit,
        skip: (page - 1) * limit
    });
    return products.map(prismaProductToProduct);
}

type getProductsFilteredRequestType = {
    offset?:number,
    limit?:number,
    name?: string,
    brand?: string,
    seller?: string,
    sellerId?: number,
    hasStock?: boolean,
}

export async function getProductsFiltered(parameters:getProductsFilteredRequestType){
    const seller = await prisma.seller.findFirst({
        where : {name : parameters.seller, isDeleted: false}
    })
    if(parameters.sellerId && seller){
        if(parameters.sellerId !== seller.id){
            throw new ValidationError("El ID del vendedor no coincide con el nombre del vendedor proporcionado.");
        }
    }
    const sellerId = parameters.sellerId || seller?.id;
    const greaterThan = parameters.hasStock ? 0 : undefined;
    const filteredProducts = await prisma.product.findMany({
        where:{
            name : parameters.name,
            brand : parameters.brand,
            sellerId : sellerId,
            stock : {
                gte: greaterThan
            },
            isDeleted:false,
        },
        skip: parameters.offset,
        take: parameters.limit
    })
    return await Promise.all(filteredProducts.map(prismaProductoToForeignProduct));
}

export type SellerDetails = {
    id: number;
    name: string;
    CUIT: string;
    address: string;
    email: string;
    startOfActivities: string;
    phoneNumber: string;
    VATCondition: string;
}

function prismaSellerToSeller(prismaSeller: Prisma.SellerModel) {
    return {
        id: prismaSeller.id,
        name: prismaSeller.name,
        CUIT: prismaSeller.CUIT,
        address: prismaSeller.address,
        email: prismaSeller.email,
        startOfActivities: prismaSeller.startOfActivities.toDateString(),
        phoneNumber: prismaSeller.phoneNumber,
        VATCondition: prismaSeller.VATCondition,
    }
}

export async function getSellerDetails(id:string) {
    const coercionSchema = z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" });
    const sellerId = coercionSchema.parse(id);
    const seller = await prisma.seller.findUniqueOrThrow({
        where: { id: sellerId, isDeleted:false },
    });
    return prismaSellerToSeller(seller);
}

export type SellerNameId = {
    id: number;
    name: string;
}

export async function getSellerNamesIds() {
    const sellers = await prisma.seller.findMany({
        where: { isDeleted: false },
    });
    return sellers.map((seller) => ({ name: seller.name, id: seller.id }));
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
        vendedorId: prismaProduct.sellerId,
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
    return await prismaProductoToForeignProduct(product);
}



export async function getSellerName(id : string) {
    const coercionSchema = z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" });
    const sellerId = coercionSchema.parse(id);
    const seller = await prisma.seller.findUniqueOrThrow({
        where: { id: sellerId, isDeleted:false},
    });
    return seller.name;
}

export async function validateSellerId(id : number) {
    return await prisma.seller.count({ where: { id:id, isDeleted:false }}) > 0;    
}

export async function checkUser(clerkId:string|undefined){
    const seller = clerkId ? await prisma.seller.findFirst({ where: {
        NOT: { ClerkUserId: null },
        ClerkUserId: clerkId, 
        isDeleted : false,
    }}) : undefined;
    return seller ? seller.id : undefined;
}

type createSellerRequestType = {
    name: string;
    CUIT: string;
    address: string;
    email: string;
    startOfActivities: Date;
    phoneNumber: string;
    VATCondition: string;
    ClerkUserId: string;
}

export async function createSeller(validatedData:createSellerRequestType){
    const seller = await prisma.seller.create({
        data: validatedData
    });
    return `/seller/${seller.id}`;
}

type createSaleRequestType = {
    date: Date,
    sellerId: number,
    price: number,
    productIds: number[],
}

export async function createSale( validatedData: createSaleRequestType){
    const saleId = (await prisma.sale.create({
        data:{
            date: validatedData.date,
            totalPrice: validatedData.price,
            seller:{
                connect: { id: validatedData.sellerId}
            }
        }
    })).id;
    await Promise.all(validatedData.productIds.map((id) => addProductToSale(saleId, id)));
}

async function addProductToSale(saleId:number, productId:number){
    await prisma.productOnSale.upsert({
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
    await prisma.product.update({
        where: { id: productId },
        data: {
            stock: {
                decrement: 1
            }
        }
    });
}

export async function getValidProducts(sellerId:number){
    return await prisma.product.findMany({where:{sellerId:sellerId, isDeleted:false}}); 
}

export async function getProductDetails(id:string){
    const coercionSchema = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
    const productId = coercionSchema.parse(id);
    const product = await prisma.product.findUniqueOrThrow({
        where: { id: productId, isDeleted:false},
    });
    return prismaProductToProduct(product);
}

export async function addStock(id: string, stock: number){
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
    const coercionSchemaStock = z.coerce.number().int().positive({ message: "El incremento en el stock del producto debe ser un entero positivo" });
    const productId = coercionSchemaId.parse(id);
    const addedStock = coercionSchemaStock.parse(stock);
    try{
    const product = await prisma.product.update({
        where: {id : productId, isDeleted:false},
        data: {
            stock :{
                increment: addedStock,
            },
        },
    })
    revalidatePath(`/seller/${product.sellerId}/products/${product.id}`); 
    } catch(err){
        throw new Error("Error del servidor, no se pudo actualizar el stock")
    }
}

export async function changePrice(id: string, price: number){
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
    const coercionSchemaPrice = z.coerce.number().gt(0, { message: "El precio debe ser mayor que 0" });
    const productId = coercionSchemaId.parse(id);
    const changedPrice = coercionSchemaPrice.parse(price);
    try{
    const product = await prisma.product.update({
        where: {id : productId, isDeleted : false},
        data: {
            price : changedPrice
        },
    })
    revalidatePath(`/seller/${product.sellerId}/products/${product.id}`); 
    } catch(err){
        throw new Error("Error del servidor, no se pudo actualizar el stock")
    }
}

export async function changeDescription(id: string, description: string){
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
    const productId = coercionSchemaId.parse(id);
    try{
        const product = await prisma.product.update({
            where: {id : productId, isDeleted : false},
            data: {
                description: description
            }
        });
        revalidatePath(`/seller/${product.sellerId}/products/${product.id}`);
    } catch(err){
        throw new Error("Error del servidor, no se pudo actualizar la descripción");
    }
}

export async function changeImageLink(id: string, imageLink: string){
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
    const coercionSchemaImageLink = z.string().url({ message: "La imagen debe ser una URL válida" });
    const productId = coercionSchemaId.parse(id);
    const validImageLinkParse = coercionSchemaImageLink.safeParse(imageLink);
    if(!validImageLinkParse.success){
        throw new Error("El enlace de la imagen no es válido. Asegúrate de que sea una URL correcta.");
    }
    const validImageLink = validImageLinkParse.data;
    try{
        const product = await prisma.product.update({
            where: {id : productId, isDeleted : false},
            data: {
                image: validImageLink
            }
        });
        revalidatePath(`/seller/${product.sellerId}/products/${product.id}`);
    } catch(err){
        throw new Error("Error del servidor, no se pudo actualizar el enlace de la imagen");
    }
}

export type SaleDetails = {
    id: number;
    date: Date;
    totalPrice: string;
    sellerName: string;
    products: string;
}

function prismaSaleToSaleDetails(prismaSale: { id: number; date: Date; totalPrice: Prisma.Decimal }, sellerName: string, productsOnSale: { product: { name: string; }; productId: number; productAmount: number; }[]): SaleDetails {
    const products = productsOnSale.map((pos) => ` "${pos.product.name}" X ${pos.productAmount}`).join(", ");
    return {
        id: prismaSale.id,
        date: prismaSale.date,
        totalPrice: prismaSale.totalPrice.toString(),
        sellerName: sellerName,
        products: products
    };
}

export async function getSales(sellerId?: string): Promise<SaleDetails[]> {
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" }).optional();
    const validSellerId = coercionSchemaId.parse(sellerId);
    const salesWithSeller = await prisma.sale.findMany({
        where: { sellerId: validSellerId, isDeleted:false },
        select: {
            id: true,
            date: true,
            totalPrice: true,
            seller: {
                select: {
                    name: true,
                }
            }
        }
    });
    return await Promise.all(salesWithSeller.map(async (sale) => {
        const productsOnSale = await prisma.productOnSale.findMany({
            where: { saleId: sale.id },
            select: {
                productId: true,
                productAmount: true,
                product: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        return prismaSaleToSaleDetails({ id: sale.id, date: sale.date, totalPrice: sale.totalPrice }, sale.seller.name, productsOnSale);
    }));
}

export async function getTotalSalesValue(sellerId?: string): Promise<string> {
    const coercionSchemaId = z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" }).optional();
    const validSellerId = coercionSchemaId.parse(sellerId);
    const totalSalesValue = await prisma.sale.aggregate({
        where: { sellerId: validSellerId, isDeleted:false },
        _sum: {
            totalPrice: true,
        }
    });
    return totalSalesValue._sum.totalPrice ? totalSalesValue._sum.totalPrice.toString() : "0";
}




export async function deleteSeller(id:string){
    const coercionSchema = z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" });
    const sellerId = coercionSchema.parse(id);
    const client = await clerkClient();
    const authData = await auth();
    if(authData.sessionId){
        await client.sessions.revokeSession(authData.sessionId);
    }
    revalidatePath("/");
    if(authData.userId){
        await client.users.deleteUser(authData.userId);
        revalidatePath("/");
        await prisma.seller.update({
        where:{
            id:sellerId,
            },
            data: {isDeleted: true},
        });
        await prisma.product.updateMany({
            where: {sellerId:sellerId},
            data: {isDeleted:true},
        }); 
        await prisma.sale.updateMany({
            where: {sellerId:sellerId},
            data: {isDeleted:true},
        });
        revalidatePath("/");
        revalidatePath("/dashboard/sellers");
        revalidatePath("/seller");
    }
    redirect('/deleted-account');
}



