import { getSellerDetails } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DashboardPersonalizedSellerPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const sellerDetails = await getSellerDetails(id);

        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
                <main className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sellerDetails.name}</h1>
                            <p className="mt-1 text-sm text-zinc-500">CUIT: <span className="font-medium text-zinc-700 dark:text-zinc-300">{sellerDetails.CUIT}</span></p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/dashboard/products?sellerId=${id}`}>
                                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-full shadow">Gestionar Productos</button>
                            </Link>
                            <Link href="/dashboard/sellers">
                                <button className="px-4 py-2 border border-zinc-200 rounded-full text-zinc-800 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">Volver a Vendedores</button>
                            </Link>
                        </div>
                    </div>

                    <section className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="text-sm font-semibold text-zinc-500">Contacto</h3>
                            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Email: <span className="font-medium">{sellerDetails.email}</span></p>
                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Teléfono: <span className="font-medium">{sellerDetails.phoneNumber}</span></p>
                        </div>

                        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="text-sm font-semibold text-zinc-500">Información</h3>
                            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Dirección: <span className="font-medium">{sellerDetails.address}</span></p>
                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Inicio de actividades: <span className="font-medium">{new Date(sellerDetails.startOfActivities).toLocaleDateString()}</span></p>
                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Condición IVA: <span className="font-medium">{sellerDetails.VATCondition}</span></p>
                        </div>
                    </section>
                </main>
            </div>
        );
    } catch (err) {
        notFound();
    }
}