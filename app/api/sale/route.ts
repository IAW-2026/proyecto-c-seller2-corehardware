import { validateSellerId, getValidProductIdsFromSeller, createSale } from "@/app/lib/actions";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from 'zod';

const createSaleSchema = z.object({
    id: z.coerce.number().int().positive({ message: "El ID del pedido debe ser un entero positivo" }),
    fecha: z.coerce.date(),
    comprador_id: z.coerce.number().int().positive({ message: "El ID del comprador debe ser un entero positivo" }),
    vendedor_id: z.coerce.number().int().positive({ message: "El ID del vendedor debe ser un entero positivo" }),
    productos: z.array(z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" })).nonempty({message: "El pedido debe tener productos"}),
    monto: z.coerce.number().gt(0, { message: "El monto debe ser mayor que 0" }),
})

export async function POST(request:NextRequest) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    const data = await request.json();

    const validatedData = createSaleSchema.safeParse(data);
    if (!validatedData.success) {
        return new Response(JSON.stringify({ message: 'Datos de entrada inválidos. No se pudo crear la venta. Errores: ' + JSON.stringify(validatedData.error.flatten().fieldErrors) }), { status: 400 });
    }  
    const { fecha, vendedor_id, productos, monto} = validatedData.data;

    try{

    if(!(await validateSellerId(vendedor_id))){
        return new Response(JSON.stringify({ message: `El vendedor con id ${vendedor_id} no existe.` }), { status: 400 });    
    }

    const productIdsFromSeller = await getValidProductIdsFromSeller(vendedor_id);
    const invalidProductId = productIdsFromSeller.find(id => !productIdsFromSeller.includes(id));
    if( invalidProductId ){
        return new Response(JSON.stringify({ message: `El producto con id ${ invalidProductId } no existe o no corresponde al vendedor con id ${vendedor_id} especificado en el pedido`}));
    }

    await createSale( {date:fecha, sellerId:vendedor_id, productIds:productos, price:monto} );

    } catch(err){
        return new Response(JSON.stringify({message: "Error del servidor, no se pudo crear venta."}),{ status:500 });
    }
    const response = await fetch("/api/shipment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.SHIPPINGAPP_API_KEY || "",
            },
            body: JSON.stringify(data),
        });
    const shipment = await response.json();
    if(shipment.message){
        return new Response(JSON.stringify({message: shipment.message}) , { status: response.status })
    }
    return new Response(JSON.stringify(validatedData.data), { status: 201})
}