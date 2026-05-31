'use client';

import Link from "next/link";
import { use } from "react";
import { deleteSeller } from "@lib/actions";

export default function DeleteSellerPage( {params}: {params: Promise<{ id: string }>}){
    const {id} = use(params);

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-4xl font-bold text-blue-500 mb-8">¿Está seguro que desea eliminar su cuenta?</h1>
                    <Link href={`/seller/${id}/`}>
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">No, volver a la página de vendedor</button>
                    </Link>
                    <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200" onClick={async () => await deleteSeller(id)}>Si, eliminar cuenta</button>
                </div>
            </main>
        </div>
    );
}