import { headers } from "next/headers";
import { getSellerGrowthForRange } from "@lib/analytics/actions";

export async function GET(request: Request) {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");
    if (apiKey !== process.env.PUBLIC_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
        return new Response(JSON.stringify({ message: 'Parámetros from y to son requeridos' }), { status: 400 });
    }

    try {
        const fromDate = new Date(from);
        // Llevamos "to" a fin de día (23:59:59.999 UTC) para incluir altas
        // ocurridas en cualquier momento de ese día, no solo hasta la medianoche.
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);

        const growth = await getSellerGrowthForRange(fromDate, toDate);
        return new Response(JSON.stringify({ total: growth.length, items: growth }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo obtener el crecimiento de vendedores.' }), { status: 500 });
    }
}