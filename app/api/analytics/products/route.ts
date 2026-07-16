import { headers } from "next/headers";
import { getAllProductsForAnalytics } from "@lib/analytics/actions";

export async function GET() {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if (apiKey !== process.env.PUBLIC_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const products = await getAllProductsForAnalytics();
        const items = products.map((p) => ({
            id: p.id,
            nombre: p.name,
            vendedor_id: p.sellerId,
        }));
        return new Response(JSON.stringify({ total: items.length, items }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los productos.' }), { status: 500 });
    }
}