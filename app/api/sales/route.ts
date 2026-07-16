import { headers } from "next/headers";
import { getForeignSales } from "@/app/lib/actions";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const { sales, total } = await getForeignSales(limit, offset);
        return new Response(JSON.stringify({ sales, total }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener las ventas.' }), { status: 500 });
    }
}
