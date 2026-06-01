'use client';

import Link from "next/link";
import { use } from "react";
import { deleteSeller } from "@lib/actions";

export default function DeleteSellerPage( {params}: {params: Promise<{ id: string }>}){
    const {id} = use(params);

    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-3xl rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                <div className="flex flex-col gap-8 text-center sm:text-left">
                    <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.28em] text-red-600">Confirmación de eliminación</p>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">¿Está seguro que desea eliminar su cuenta?</h1>
                        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                            Esta acción no se puede deshacer. Si elimina su cuenta, sus productos ya no se mostraran y no podrá recibir ventas.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link href={`/seller/${id}/`}>
                            <button className="w-full rounded-3xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                                No, volver a la página de vendedor
                            </button>
                        </Link>
                        <button className="w-full rounded-3xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-700 hover:to-rose-700" onClick={async () => await deleteSeller(id)}>
                            Sí, eliminar cuenta
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}