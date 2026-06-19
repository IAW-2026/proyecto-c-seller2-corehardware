'use server';

import { checkUser, getSeller } from "@/app/lib/actions";
import { headers } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { JOSEError } from "jose/errors";


const JWKS = createRemoteJWKSet(
 new URL(`https://${process.env.CLERK_DOMAIN}/.well-known/jwks.json`)
)


export async function verifyToken(token: string) {
 const { payload } = await jwtVerify(token, JWKS, {
 issuer: `https://${process.env.CLERK_DOMAIN}`,
 })
 return payload
}


export async function GET() {

    
    const requestHeaders = await headers();
    const bearer = requestHeaders.get("Authorization") ?? "";
    const token = bearer.replace("Bearer ", "");
    
    if(!token ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    } else{
        try{
            const { sub } = await verifyToken(token);
            const id = await checkUser(sub);
            if( !id ) return new Response(JSON.stringify({message:"No se pudo encontrar al vendedor"}), { status: 404 });
            const foreignSeller = await getSeller({ id: id }); 
            return new Response(JSON.stringify(foreignSeller), { status: 200 });        
        } catch(e){
            if ( e instanceof JOSEError) return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
            return new Response(JSON.stringify({message:"No se pudo encontrar al vendedor"}), { status: 404 })    
        }    
    }


    
}