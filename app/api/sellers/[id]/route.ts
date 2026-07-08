'use server';

import { z } from "zod";
import { getSeller, updateSeller } from "@/app/lib/actions";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{ id: string }>}) {
    const parameters = await params;
    const validatedParams = z.object({id: z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" })}).safeParse(parameters);
    if (!validatedParams.success) {
        return new Response(JSON.stringify({ message: 'Datos de entrada inválidos. No se pudo crear la venta. Errores: ' + JSON.stringify(validatedParams.error.flatten().fieldErrors) }), { status: 400 });
    } 
    const { id } = validatedParams.data;
    
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    } else{

        try{
            const foreignSeller = await getSeller({ id: id }) 
            return new Response(JSON.stringify(foreignSeller), { status: 200 });        
        } catch(e){
            return new Response(JSON.stringify({message:"No se pudo encontrar al vendedor"}), { status: 404 })    
        }    
    }

}

const updateSellerSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email({ message: "El correo electrónico debe ser válido" }).optional(),
    phoneNumber: z.string().optional(),
}).strict();
 
export async function PATCH(request: NextRequest, {params}: {params: Promise<{ id: string }>}) {
    const parameters = await params;
    const validatedParams = z.object({id: z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" })}).safeParse(parameters);
    if (!validatedParams.success) {
        return new Response(JSON.stringify({ message: 'ID de vendedor inválido. Errores: ' + JSON.stringify(validatedParams.error.flatten().fieldErrors) }), { status: 400 });
    }
    const { id } = validatedParams.data;
 
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if (apiKey !== process.env.PUBLIC_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
 
    const data = await request.json();
    const validatedData = updateSellerSchema.safeParse(data);
    if (!validatedData.success) {
        return new Response(JSON.stringify({ errors: validatedData.error.flatten().fieldErrors, message: 'Datos de entrada inválidos. No se pudo actualizar el vendedor.' }), { status: 400 });
    }
 
    try {
        const updated = await updateSeller({ id, ...validatedData.data });
        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: "No se pudo encontrar al vendedor" }), { status: 404 });
    }
}