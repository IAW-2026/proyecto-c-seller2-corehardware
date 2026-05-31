'use client';

import Link from "next/link";
import ProductList from "@ui/products/productList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function DashboardProducts() {
    const searchParams = useSearchParams();
    const [sellerId, setSellerId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const sellerIdParam = searchParams.get("sellerId");
        const validationSchema = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
        const validatedSellerId = validationSchema.safeParse(sellerIdParam);
        if (validatedSellerId.success) {
            setSellerId(validatedSellerId.data);
        } else {
            setSellerId(undefined);
        }    
    }, [searchParams]);

    return (
        <div className="flex flex-col flex-1 items-left justify-start bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-42 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        Páguina de Productos
                    </h1>
                    <Link href="/dashboard/products/create">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Crear Producto
                        </button>
                    </Link>
                    <ProductList onDashboard={true} sellerId={sellerId} />
                </div>
            </main>
        </div>
    );
}

