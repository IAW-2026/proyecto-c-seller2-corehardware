import DeleteProduct from "@/app/ui/products/deleteProduct"
import Link from "next/link";

export default function DashboardDeleteProductPage({params}: {params: Promise<{ id: string }>}) {
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
                <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="space-y-8 text-center sm:text-left">
                        <div className="space-y-3">
                            <h1 className="text-sm uppercase tracking-[0.3em] text-rose-600">Eliminar producto</h1>
                        </div>
                        <DeleteProduct params={params} />
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
                            <Link href="/dashboard/products">
                                <button className="rounded-3xl bg-linear-to-r from-slate-600 to-zinc-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-500/20 transition hover:from-slate-700 hover:to-zinc-800">
                                    Volver a Productos
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}