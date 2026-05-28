'use server';

import { z } from "zod";
import { getProduct } from "@/app/lib/actions";
import { headers } from "next/dist/server/request/headers";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { Prisma } from "@prismaGenerated/client";

export async function GET({params}: {request:NextRequest,params: Promise<{ id: string }>}) {
    const { id } = await params;
    const productId = Number(id);
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        //Response for wrong API KEY not yet decided
    } else{

        try{
            const foreignSeller = await getProduct({ id: productId }) 
            return new Response(JSON.stringify(foreignSeller), { status: 200 });        
        } catch(e){
            return new Response(JSON.stringify({message:"No se pudo encontrar el producto"}), { status: 404 })    
        }    
    }

}