import { headers } from "next/headers";
import { getAllSellersForAnalytics } from "@lib/analytics/actions";

export async function GET() {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if (apiKey !== process.env.PUBLIC_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const sellers = await getAllSellersForAnalytics();
        const items = sellers.map((s) => ({
            id: s.id,
            razon_social: s.name,
            cuit: s.CUIT,
            mail: s.email,
            celular: s.phoneNumber,
            condicion_iva: s.VATCondition,
            fecha_creacion: s.createdAt.toISOString(),
        }));
        return new Response(JSON.stringify({ total: items.length, items }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los vendedores.' }), { status: 500 });
    }
}