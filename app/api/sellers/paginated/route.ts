import { NextRequest } from "next/server";
import { getSellersPaginated } from "@/app/lib/actions";

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const offsetParam = searchParams.get("offset");
    const limitParam = searchParams.get("limit");

    const offset = offsetParam !== null && !Number.isNaN(Number(offsetParam)) ? Number(offsetParam) : undefined;
    const limit = limitParam !== null && !Number.isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    try {
        const result = await getSellersPaginated({ q, offset, limit });
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los vendedores.' }), { status: 500 });
    }
}