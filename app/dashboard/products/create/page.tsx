"use client";

import CreateProductForm from "@ui/products/createProductForm";


export default function DashboardCreateProduct() {
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
                <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4 text-center sm:text-left">
                            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Agregar producto</p>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Crear nuevo producto</h1>
                            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                Completa los datos del producto para añadirlo al catálogo del dashboard. Revisa toda la información antes de publicar.
                            </p>
                        </div>
                        <CreateProductForm />
                        <div className="flex justify-center sm:justify-start">
                            <button
                                className="rounded-3xl bg-linear-to-r from-slate-600 to-zinc-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-500/20 transition hover:from-slate-700 hover:to-zinc-800"
                                onClick={() => window.location.href = "/dashboard/products"}
                            >
                                Volver a Productos
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}