import { headers } from "next/headers";
import { NextRequest } from "next/server";


// Mock de la API shipment de la ShippingApp
export async function POST(request:NextRequest){
    
    try{
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.SHIPPINGAPP_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    const {id , monto} = await request.json();

    return new Response(JSON.stringify({ id:(Math.floor(Math.random()*10000)), pedido_id: id, fecha_de_entrega:"", estado:"", monto: monto+3.5, direccion:"" }),{ status: 201})
    } catch(err) { return new Response(JSON.stringify({ message: 'Bad Request' }), { status: 400 })}
}