'use client';

import Link from "next/link";
import ProductList from "@ui/products/productList";
import { use } from "react";

export default function SellerProducts({params}: {params: Promise<{ id: string }>}) {
    const id = Number(use(params).id);
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4 text-center sm:text-left">
                            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Panel del vendedor</p>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Gestión de Productos</h1>
                            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                Publica y administra tus productos desde un mismo lugar. Mantén tu inventario organizado y actualizado.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Link href={`/seller/${id}/products/create`}>
                                <button className="rounded-3xl bg-linear-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-indigo-700">
                                    Publicar Producto
                                </button>
                            </Link>
                        </div>
                        <ProductList sellerId={id} />
                    </div>
                </section>
            </main>
        </div>
    );
}