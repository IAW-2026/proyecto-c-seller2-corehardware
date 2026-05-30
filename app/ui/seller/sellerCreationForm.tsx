'use client';

import { useUser } from "@clerk/nextjs";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

type State = {
    loading: boolean;
    errors: string[] | null;
}


export default function SellerCreationForm(){
    const { user } = useUser();
    const initialState: State = {
        loading: false,
        errors: null,
    };
    const router = useRouter();
    async function createSellerAction(previousState: State, formData: FormData){
        previousState.loading = true;
        const entries = Object.fromEntries(formData.entries());
        if( !user ) {
            previousState.errors = ["Usuario no autenticado"];
            return previousState;
        } else {
            const createSellerData = {
                name: entries.name as string,
                CUIT: entries.CUIT as string,
                address: entries.address as string,
                email: entries.email as string,
                startOfActivities: entries.startOfActivities as string,
                phoneNumber: entries.phoneNumber as string,
                VATCondition: entries.VATCondition as string,
                ClerkUserId: user.id,
            };
            const response = await fetch("/api/sellers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
                },
                body: JSON.stringify(createSellerData),
            });
            if(response.status === 201){
                const location = response.headers.get("Location");
                router.push(location || "/");
                return {
                    ...previousState,
                    loading: false,
                    errors: null,
                }
            } else {
                const errorResponse = await response.json();
                return {
                    ...previousState,
                    loading: false,
                    errors: errorResponse.errors ? Object.values(errorResponse.errors).flat() : (errorResponse.message ? [errorResponse.message] : ["Error desconocido"]),
                }
            }       
    }}
    const [ state, formAction ] = useActionState(createSellerAction, initialState);
    const defaultEmail = user ? (user.emailAddresses[0]? user.emailAddresses[0].emailAddress : undefined) : undefined;
    const defaultName = user ? (user.firstName ? user.firstName + " " + (user.lastName ? user.lastName : undefined) : undefined) : undefined;
    const defaultPhoneNumber = user ? (user.phoneNumbers[0] ? user.phoneNumbers[0].phoneNumber : undefined) : undefined;

    return (
        
        <form action={formAction} className="flex flex-col gap-4 max-w-sm self-start -ml-8 text-sm">
            <div className="flex items-center gap-4">
                <label htmlFor="name" className="w-36 text-right text-base">Razón Social:</label>
                { defaultName ? (
                    <input id="name" type="text" name="name" defaultValue={defaultName} className="flex-1 border rounded px-3 py-2" />
                ) : (
                    <input id="name" type="text" name="name" placeholder="Razón Social" className="flex-1 border rounded px-3 py-2" />
                ) }
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="CUIT" className="w-36 text-right text-base">CUIT:</label>
                <input id="CUIT" type="text" name="CUIT" placeholder="XX-XXXXXXXX-X" className="flex-1 border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="address" className="w-36 text-right text-base">Dirección:</label>
                <input id="address" type="text" name="address" placeholder="Dirección" className="flex-1 border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="email" className="w-36 text-right text-base">Correo electrónico:</label>
                { defaultEmail ? (
                    <input id="email" type="email" name="email" defaultValue={defaultEmail} className="flex-1 border rounded px-3 py-2" />
                ) : (
                    <input id="email" type="email" name="email" placeholder="Correo electrónico" className="flex-1 border rounded px-3 py-2" />
                ) }
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="phoneNumber" className="w-36 text-right text-base">Teléfono:</label>
                { defaultPhoneNumber ? (
                    <input id="phoneNumber" type="text" name="phoneNumber" defaultValue={defaultPhoneNumber} className="flex-1 border rounded px-3 py-2" />
                ) : (
                    <input id="phoneNumber" type="text" name="phoneNumber" placeholder="Número de teléfono" className="flex-1 border rounded px-3 py-2" />
                ) }
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="VATCondition" className="w-36 text-right text-base">Condición IVA:</label>
                <input id="VATCondition" type="text" name="VATCondition" placeholder="Condición frente al IVA" className="flex-1 border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="startOfActivities" className="w-36 text-right text-base">Inicio de actividades:</label>
                <input id="startOfActivities" type="date" name="startOfActivities" className="flex-1 border rounded px-3 py-2" />
            </div>
            <button type="submit" disabled={state.loading} className="bg-blue-500 text-white px-5 py-3 rounded ml-10">
                { state.loading ? "Registrandose..." : "Registrarse como vendedor" }
            </button>
            { state.errors && (
                <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
                    <ul>
                        { state.errors.map((error, index) => ( 
                            <li key={index}>{error}</li>
                        )) }
                    </ul>
                </div>
            )}
        </form>
    )
}

