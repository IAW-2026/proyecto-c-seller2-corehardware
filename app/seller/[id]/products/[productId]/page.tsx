 import { getProductDetails, Product } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductPage({ params }: { params: { id: string; productId: string } }) {
  const { id, productId } = await params;

  let product: Product;
  try {
    product = await getProductDetails(productId);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-10">
      <main className="w-full max-w-6xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-blue-600">Detalle del producto</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">Vendedor ID: {product.sellerId}</p>
          </div>
          <Link
            href={`/seller/${id}`}
            className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Volver a la Página del Vendedor
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
              <img src={product.imageUrl} alt={product.name} className="h-[420px] w-full object-cover" />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Descripción</h2>
              <p className="mt-4 text-base leading-7 text-gray-700 dark:text-zinc-300">{product.description}</p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Información rápida</h2>
              <dl className="grid gap-3">
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Marca</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{product.brand}</dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Modelo</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{product.model}</dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Precio</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">${product.price}</dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Stock</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{product.stock}</dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Especificaciones</dt>
                  <dd className="text-base text-gray-900 dark:text-white">{product.specs}</dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-white p-3 dark:bg-zinc-950">
                  <dt className="text-sm text-zinc-500">Garantía</dt>
                  <dd className="text-base text-gray-900 dark:text-white">{product.warranty}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Acciones</h2>
              <div className="grid gap-3">
                <button type="button" className="w-full rounded-full bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800">
                  Agregar stock
                </button>
                <button type="button" className="w-full rounded-full bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800">
                  Cambiar precio
                </button>
                <button type="button" className="w-full rounded-full bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800">
                  Cambiar descripción
                </button>
                <button type="button" className="w-full rounded-full bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800">
                  Cambiar imagen
                </button>
              </div>
            </div>
          </aside>
        </div>

      </main>
    </div>
  );
}
