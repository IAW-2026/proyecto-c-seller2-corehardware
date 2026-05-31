
import SalesReport from "@/app/ui/sales/SalesReport";

export default async function SalesDashboard() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
            <main className="w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <header className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reporte de Ventas</h1>
                    <p className="mt-2 text-sm text-zinc-500">Resumen de ventas recientes y detalle por venta.</p>
                </header>

                <section>
                    <SalesReport />
                </section>
            </main>
        </div>
    );
}