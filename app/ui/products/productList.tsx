'use client';
import { getProductCount, getProducts, Product } from "@lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProductList({sellerId = undefined, onDashboard = false}: {sellerId?: number, onDashboard?: boolean}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [productCount, setProductCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageLimit = (sellerId) ? 10 : 5; 
    useEffect(() => {
        const fetchProducts = async () => {
            const fetchedProducts = await getProducts(pageLimit, page, sellerId);
            const fetchedProductCount = await getProductCount(sellerId);
            setProducts(fetchedProducts);
            setProductCount(fetchedProductCount);
            setLoading(false);
        };
        fetchProducts();
    }, [page]);
    if(loading) return( <div className="flex items-center justify-center py-8"><p className="text-sm text-zinc-600 dark:text-zinc-400">Cargando productos...</p></div> )
    return (
        <div className="space-y-4">
            <ul className="space-y-3">
                {products.map((product) => (
                    <li key={product.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
                        {!onDashboard && (
                            <div className="flex items-center gap-4">
                                <img src={product.imageUrl} alt={product.name} className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">{product.name}</h2>
                                    <p className="text-xs text-zinc-500">{product.brand} • {product.model}</p>
                                    <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300">Precio: <span className="font-medium">${product.price}</span> · Stock: <span className="font-medium">{product.stock}</span></p>
                                </div>
                                <Link href={`/seller/${sellerId}/products/${product.id}`}>
                                    <button className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-700 hover:to-teal-700">
                                        Ver Detalles
                                    </button>
                                </Link>
                            </div>
                        )}
                        {onDashboard && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-4">
                                    <img src={product.imageUrl} alt={product.name} className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{product.name}</h2>
                                        <p className="text-xs text-zinc-500">{product.brand} • {product.model}</p>
                                        <p className="text-xs text-zinc-700 dark:text-zinc-300">Precio: <span className="font-medium">${product.price}</span> · Stock: <span className="font-medium">{product.stock}</span></p>
                                    </div>
                                </div>
                                <div className="grid gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3">
                                    <div><span className="font-medium">Vendedor:</span> {product.sellerId}</div>
                                    <div><span className="font-medium">Descripción:</span> {product.description}</div>
                                    <div><span className="font-medium">Especificaciones:</span> {product.specs}</div>
                                    <div><span className="font-medium">Garantía:</span> {product.warranty}</div>
                                    <div className="truncate"><span className="font-medium">URL:</span> <span className="break-all">{product.imageUrl}</span></div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/products/${product.id}/edit`}>
                                        <button className="rounded-3xl bg-linear-to-r from-amber-600 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-700 hover:to-orange-700">
                                            Editar
                                        </button>
                                    </Link>
                                    <Link href={`/dashboard/products/${product.id}/delete`}>
                                        <button className="rounded-3xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                            Eliminar
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            { products.length === 0 && (
                <div className="text-center py-8"><p className="text-sm text-zinc-600 dark:text-zinc-400">No hay más productos para mostrar</p></div>
            ) }
            { productCount > pageLimit && (
            <div className="flex justify-between gap-2 pt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    disabled={products.length === 0}
                >
                    Siguiente
                </button>
            </div>
            )}
        </div>
    );
}