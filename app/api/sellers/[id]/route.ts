'use server';

import { z } from "zod";
import { getSeller } from "@/app/lib/actions";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{ id: string }>}) {
    const parameters = await params;
    const validatedParams = z.object({id: z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" })}).safeParse(parameters);
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

