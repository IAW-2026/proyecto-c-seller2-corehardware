import { getBestSellingProducts } from "@/app/lib/actions";
import { NextRequest } from "next/server";
import { z } from "zod";


const getBestSellingProductsSchema = z.object({
    limit: z.coerce.number().int().nonnegative({message: "El límite no puede ser negativo"}).default(5),
    sellerId: z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" }).optional(),
})

export async function GET(request: NextRequest){
    const requestHeaders = request.headers;
    const apiKey = requestHeaders.get("X-API-Key");
    if(apiKey !== process.env.PUBLIC_API_KEY ){
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const limit = searchParams.get("limit") ?? undefined;
    const sellerId = searchParams.get("sellerId") ?? undefined;
    const validatedParams = getBestSellingProductsSchema.safeParse({
        limit,
        sellerId,
    });
    if (!validatedParams.success) {
        return new Response(JSON.stringify({ message: validatedParams.error.flatten() }), { status: 400 });
    }
    try{
        const bestSellingProducts = await getBestSellingProducts(validatedParams.data.limit, validatedParams.data.sellerId);
        return new Response(JSON.stringify({items: bestSellingProducts}), { status: 200 });
    } catch(e){
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los productos más vendidos.' }), { status: 500 });
    }
}