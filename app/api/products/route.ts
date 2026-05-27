import { z } from "zod";
import { createProduct, deleteProduct } from "@lib/actions";
import { headers } from "next/dist/server/request/headers";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { Prisma } from "@prismaGenerated/client";


const createProductSchema = z.object({
  name: z.string(),
  sellerId: z.coerce.number().int().positive({ message: "El Seller ID debe ser un entero positivo" }).optional(),
  brand: z.string(),
  model: z.string(),
  price: z.coerce.number().gt(0, { message: "El precio debe ser mayor que 0" }),
  stock: z.coerce.number().int().nonnegative({ message: "El stock debe ser un entero no negativo" }),
});


export async function POST(request: NextRequest) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        console.log(apiKey);
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
        console.log(apiKey);
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