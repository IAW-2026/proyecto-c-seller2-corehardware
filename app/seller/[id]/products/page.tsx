'use client';

import Link from "next/link";
import ProductList from "@ui/products/productList";
import { use } from "react";

export default function SellerProducts({params}: {params: Promise<{ id: string }>}) {
    const id = Number(use(params).id);
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        Gestión de Productos
                    </h1>
                    <Link href={`/seller/${id}/products/create`}>
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Crear Producto
                        </button>
                    </Link>
                    <ProductList sellerId={id} />
                </div>
            </main>
        </div>
    );
}