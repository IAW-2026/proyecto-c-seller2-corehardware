'use client';

import Link from "next/link";
import { Suspense } from "react";
import SearchParamsBasedProductsList from "@/app/ui/products/searchParamsBasedProductList"

export default function DashboardProducts() {
    return (
        <div className="flex flex-col flex-1 justify-between py-12 px-42 bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        Páguina de Productos
                    </h1>
                    <Link href="/dashboard/products/create">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Crear Producto
                        </button>
                    </Link>
                    <Suspense fallback = {<h1 className="text-3xl font-bold mb-4"> Cargando productos...</h1>} >
                        <SearchParamsBasedProductsList />    
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

