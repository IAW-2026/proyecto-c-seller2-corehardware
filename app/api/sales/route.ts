import { headers } from "next/headers";
import { getForeignSales } from "@/app/lib/actions";


export async function GET() {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const sales = await getForeignSales();
        return new Response(JSON.stringify(sales), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener las ventas.' }), { status: 500 });
    }
}
