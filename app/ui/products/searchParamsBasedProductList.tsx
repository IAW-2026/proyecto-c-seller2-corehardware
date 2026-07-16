'use client';

import ProductList from "@ui/products/productList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";


export default function SearchParamsBasedProductsList(){
    const searchParams = useSearchParams();
    const [sellerId, setSellerId] = useState<string | undefined>(undefined);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const sellerIdParam = searchParams.get("sellerId");
        const validationSchema = z.string().cuid({ message: "El ID del vendedor debe ser un cuid válido" });
        const validatedSellerId = sellerIdParam ? validationSchema.safeParse(sellerIdParam) : undefined;

        if (validatedSellerId?.success) {
            setSellerId(validatedSellerId.data);
        } else {
            setSellerId(undefined);
        }

        setLoaded(true);
    }, [searchParams]);

    return (
        <div>
            {!isLoaded && <div className="flex items-center justify-center py-8"><p className="text-sm text-zinc-600 dark:text-zinc-400">Cargando productos...</p></div>}
            {isLoaded && <ProductList onDashboard={true} sellerId={sellerId} />}
        </div>
    );
}