
import Link from "next/link";
import { getSellerName } from "@lib/actions";

export default async function PersonalizedSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sellerName = await getSellerName(id);

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-32">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 sm:px-6">
        <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Panel de Vendedor</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Bienvenido, {sellerName}</h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Administra tus productos, revisa tus ventas y gestiona tu cuenta desde un panel cómodo y moderno.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Link href={`/seller/${id}/products/`}>
                <button className="w-full rounded-3xl bg-linear-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-indigo-700">
                  Gestionar Productos
                </button>
              </Link>
              <Link href={`/seller/${id}/sales/`}>
                <button className="w-full rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-700 hover:to-teal-700">
                  Ver Ventas
                </button>
              </Link>
              <Link href={`/seller/${id}/delete-account/`}>
                <button className="w-full rounded-3xl border border-zinc-200 bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-zinc-300 hover:bg-red-900 dark:border-zinc-700 dark:bg-zinc-900">
                  Borrar Cuenta
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
