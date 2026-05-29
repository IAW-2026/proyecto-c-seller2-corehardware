import { z } from "zod";
import { createProduct, deleteProduct, editProduct, getProductsFiltered } from "@lib/actions";
import { headers } from "next/dist/server/request/headers";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { Prisma } from "@prismaGenerated/client";


const getProductsFilteredSchema = z.object({
    offset: z.coerce.number().int().nonnegative({message: "El offset no puede ser negativo"}).optional(),
    limit: z.coerce.number().int().nonnegative({message: "El límite no puede ser negativo"}).optional(),
    name: z.string().optional(),
    brand: z.string().optional(),
    seller: z.string().optional(),
    hasStock: z.boolean().optional()    
})

export async function GET(request:NextRequest){
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const offset = searchParams.get("offset") ?? undefined;
    const limit = searchParams.get("limit") ?? undefined;
    const name = searchParams.get("name") ?? undefined;
    const brand = searchParams.get("brand") ?? undefined;
    const seller = searchParams.get("seller") ?? undefined;
    const hasStock = searchParams.get("hasStock") ?? undefined;
    const validatedParams = getProductsFilteredSchema.safeParse({
        offset,
        limit,
        name,
        brand,
        seller,
        hasStock,
    });

    if(!validatedParams.success){
        return new Response(JSON.stringify({ errors: validatedParams.error.flatten().fieldErrors, message: 'Parámetros de consulta inválidos.' }), { status: 404 });
    }

    try{
        const products = await getProductsFiltered(validatedParams.data);
        return new Response(JSON.stringify(products), { status: 200 });
    } catch(e){
        console.log(e);
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los productos.' }), { status: 500 });
    };
}


const createProductSchema = z.object({
  name: z.string(),
  sellerId: z.coerce.number().int().positive({ message: "El Seller ID debe ser un entero positivo" }),
  brand: z.string(),
  model: z.string(),
  price: z.coerce.number().gt(0, { message: "El precio debe ser mayor que 0" }),
  stock: z.coerce.number().int().nonnegative({ message: "El stock debe ser un entero no negativo" }),
  description: z.string(),
  specs: z.string(),
  warranty: z.string(),
  image: z.string().url({ message: "La imagen debe ser una URL válida" }),
});


export async function POST(request: NextRequest) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    
    const data = await request.json();
    const validatedData = createProductSchema.safeParse({
        name: data.name,
        sellerId: data.sellerId,
        brand: data.brand,
        model: data.model,
        price: data.price,
        stock: data.stock,
        description: data.description,
        specs: data.specs,
        warranty: data.warranty,
        image: data.image,
    });
    
    if (!validatedData.success) {
        return new Response(JSON.stringify({ errors: validatedData.error.flatten().fieldErrors, message: 'Datos de entrada inválidos. No se pudo crear el producto.' }), { status: 400 });
    }

    try {
        const product = await createProduct(validatedData.data);
        return new Response(JSON.stringify(product), { status: 201 });
    } catch (e) {
        if ( e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            return new Response(JSON.stringify({ message: 'El vendedor especificado no existe.' }), { status: 400 });
        } else {
            console.log(e);
            return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo crear el producto.' }), { status: 500 });
        }
    }
}

const deleteProductSchema = z.object({ id: z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" }) });

export async function DELETE(request: NextRequest) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    
    const data = await request.json();
    const validatedData = deleteProductSchema.safeParse({
        id: data.id,
    });
    
    if (!validatedData.success) {
        return new Response(JSON.stringify({ message: 'ID inválido, no se pudo borrar el producto' }), { status: 400 });
    }

    try {
        const product = await deleteProduct(validatedData.data);
        return new Response(JSON.stringify(product), { status: 200 });
    } catch (e) {
        if ( e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            return new Response(JSON.stringify({ message: 'El producto con el Id especificado no existe o ya fue eliminado' }), { status: 404 });
        } else {
            console.log(e);
            return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo crear el producto.' }), { status: 500 });
        }
    }
}

const editProductSchema = z.object({
    id: z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" }),
    name: z.string().optional(),
    sellerId: z.coerce.number().int().positive({ message: "El Seller ID del producto debe ser un entero positivo" }).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    price: z.coerce.number().gt(0, { message: "El precio debe ser mayor que 0" }).optional(),
    stock: z.coerce.number().int().nonnegative({ message: "El stock debe ser un entero no negativo" }).optional(),
    description: z.string().optional(),
    specs: z.string().optional(),
    warranty: z.string().optional(),
    image: z.string().url({ message: "La imagen debe ser una URL válida" }).optional(),
});

export async function PUT(request: NextRequest) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    
    const data = await request.json();
    const validatedData = editProductSchema.safeParse({
        id: data.id,
        name: data.name,
        sellerId: data.sellerId,
        brand: data.brand,
        model: data.model,
        price: data.price,
        stock: data.stock,
        description: data.description,
        specs: data.specs,
        warranty: data.warranty,
        image: data.image,
    });
    
    if (!validatedData.success) {
        return new Response(JSON.stringify({ errors: validatedData.error.flatten().fieldErrors, message: 'Datos de entrada inválidos. No se pudo editar el producto.' }), { status: 400 });
    }

    try {
        const product = await editProduct(validatedData.data);
        return new Response(JSON.stringify(product), { status: 200 });
    } catch (e) {
        if ( e instanceof Prisma.PrismaClientKnownRequestError && (e.code === 'P2025' || e.code === 'P2003')) {
            return new Response(JSON.stringify({ message: 'El id de producto o vendedor especificado corresponde a un producto o vendedor que no existe.' }), { status: 404 });
        } else {
            console.log(e);
            return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo crear el producto.' }), { status: 500 });
        }
    }
}