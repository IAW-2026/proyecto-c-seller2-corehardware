import { validateSellerId, getValidProducts, createSale } from "@/app/lib/actions";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from 'zod';

const createSaleSchema = z.object({
    fecha: z.coerce.date(),
    vendedor_id: z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" }),
    productos: z.array(z.string().cuid({ message: "El ID del producto debe ser un cuid válido" })).nonempty({ message: "El pedido debe tener productos" }),
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

    const validProducts = await getValidProducts(vendedor_id);
    const productIdsFromSeller = validProducts.map(product => product.id);
    const invalidProductId = productos.find(id => !productIdsFromSeller.includes(id));
    if( invalidProductId ){
        return new Response(JSON.stringify({ message: `El producto con id ${ invalidProductId } no existe o no corresponde al vendedor con id ${vendedor_id} especificado en el pedido`}));
    }

    const countsMap: Map<string, number> = new Map();
    productos.forEach(id => {
        countsMap.set(id, (countsMap.get(id) || 0) + 1);
    });

    const productWithInsufficientStock = validProducts.find(product => {
        const requestedQuantity = countsMap.get(product.id) || 0;
        return requestedQuantity > product.stock;
    });

    if (productWithInsufficientStock) {
        return new Response(JSON.stringify({ message: `El producto con id ${productWithInsufficientStock.id} no tiene stock suficiente para la cantidad solicitada en el pedido` }), { status: 400 });
    }

    await createSale( {date:fecha, sellerId:vendedor_id, productIds:productos, price:monto} );

    } catch(err){
        return new Response(JSON.stringify({message: "Error del servidor, no se pudo crear venta."}),{ status:500 });
    }

    const URL = "https://proyecto-c-shipping2-corehardware.vercel.app/api/shipment";
    const response = await fetch(URL, {
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

    const URL2 = `https://proyecto-c-buyer2-corehardware.vercel.app/api/orders/${data.id}/status`;
    const response2 = await fetch(URL2, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.BUYER_API_KEY || "",
        },
        body: JSON.stringify({ estado: "EN_PREPARACION" }),
    });

    const orderStatus = await response2.json();
    if(orderStatus.message){
        console.error("Error al actualizar el estado del pedido en la API del comprador:", orderStatus.message);
    }

    return new Response(JSON.stringify(validatedData.data), { status: 201})
}