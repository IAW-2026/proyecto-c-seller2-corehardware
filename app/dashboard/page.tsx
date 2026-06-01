import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-25">
      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
          <div className="flex flex-col gap-8 text-center sm:text-left">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Panel administrativo</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard de Administración CoreHardware
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Administra todos los aspectos de tu plataforma: productos, vendedores y ventas en un solo lugar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/dashboard/products">
                <button className="rounded-3xl bg-linear-to-r from-sky-600 to-indigo-600 px-12 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-indigo-700">
                  Mostrar Productos
                </button>
              </Link>
              <Link href="/dashboard/sellers">
                <button className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 px-12 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-700 hover:to-teal-700">
                  Mostrar Vendedores
                </button>
              </Link>
              <Link href="/dashboard/sales">
                <button className="rounded-3xl bg-linear-to-r from-orange-600 to-amber-600 px-18 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-700 hover:to-amber-700">
                  Mostrar Ventas
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}