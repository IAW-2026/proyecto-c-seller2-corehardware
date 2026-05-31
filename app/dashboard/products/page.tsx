'use client';

import Link from "next/link";
import { Suspense } from "react";
import SearchParamsBasedProductsList from "@/app/ui/products/searchParamsBasedProductList"

export default function DashboardProducts() {
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Gestión de inventario</p>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Productos
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                Gestiona todos los productos disponibles en tu plataforma.
                            </p>
                        </div>
                        <Link href="/dashboard/products/create">
                            <button className="rounded-3xl bg-linear-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-indigo-700">
                                Crear Producto
                            </button>
                        </Link>
                        <Suspense fallback={<div className="flex items-center justify-center py-12"><p className="text-sm text-zinc-600 dark:text-zinc-400">Cargando productos...</p></div>}>
                            <SearchParamsBasedProductsList />
                        </Suspense>
                    </div>
                </section>
            </main>
        </div>
    );
}

