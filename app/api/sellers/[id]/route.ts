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
    name: z.string(),
    CUIT: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, { message: "El CUIT debe tener el formato XX-XXXXXXXX-X" }),
    address: z.string(),
    email: z.string().email({ message: "El correo electrónico debe ser válido" }),
    phoneNumber: z.string(),
    VATCondition: z.string(),
    startOfActivities: z.coerce.date(),
});

export async function PATCH(request: NextRequest, {params}: {params: Promise<{ id: string }>}) {
    
    const apiKey = request.headers.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    const parameters = await params;
    const validatedParams = z.object({id: z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" })}).safeParse(parameters);
    const requestBody = await request.json();
    const validatedBody = updateSellerSchema.safeParse(requestBody);
    let errors = undefined;
    if (!validatedParams.success){
        errors = validatedParams.error.flatten().fieldErrors;
    }
    if (!validatedBody.success){
        errors = (errors) ? {...errors, ...validatedBody.error.flatten().fieldErrors} : validatedBody.error.flatten().fieldErrors;
    }
    if(errors){
        return new Response(JSON.stringify({ message: 'Datos de entrada inválidos. No se pudo actualizar el vendedor. Errores: ' + JSON.stringify(errors) }), { status: 400 });
    }
    if(validatedParams.success && validatedBody.success){
        const { id } = validatedParams.data;
        const updateData = validatedBody.data;
        try{
            const updatedSeller = await updateSeller({ id, ...updateData });
            return new Response(JSON.stringify(updatedSeller), { status: 200 });
        } catch(e){
            return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo actualizar el vendedor.' }), { status: 500 });
        }
    }
    
}