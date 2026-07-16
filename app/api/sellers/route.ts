import { NextRequest } from "next/server";
import { z } from "zod";
import { createSeller, getSellers } from "@/app/lib/actions";
import { headers } from "next/headers";

const createSellerSchema = z.object({
    name: z.string(),
    CUIT: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, { message: "El CUIT debe tener el formato XX-XXXXXXXX-X" }),
    address: z.string(),
    email: z.string().email({ message: "El correo electrónico debe ser válido" }),
    phoneNumber: z.string(),
    VATCondition: z.string(),
    startOfActivities: z.coerce.date(),
    ClerkUserId: z.string(),
});


export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
        }
    const data = await request.json();

    const validatedData = createSellerSchema.safeParse(data);
    if (!validatedData.success) {
        return new Response(JSON.stringify({ errors: validatedData.error.flatten().fieldErrors, message: 'Datos de entrada inválidos. No se pudo crear el vendedor.' }), { status: 400 });
    }

    try {
        const sellerUrl = await createSeller(validatedData.data);
        const response = new Response( null,{status: 201});
        response.headers.set("Location", sellerUrl);
        return response;
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudo crear el vendedor.' }), { status: 500 });
    }
}


export async function GET() {
    const requestHeaders = await headers();
    const apiKey = requestHeaders.get("X-API-Key");

    if (apiKey !== process.env.NEXT_PUBLIC_PRIVATE_API_KEY) {
        return new Response(JSON.stringify({ message: 'Acceso no autorizado' }), { status: 401 });
    }

    try {
        const sellers = await getSellers();
        return new Response(JSON.stringify(sellers), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor. No se pudieron obtener los vendedores.' }), { status: 500 });
    }

}
