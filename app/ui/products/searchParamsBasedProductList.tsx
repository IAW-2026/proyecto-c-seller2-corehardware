'use client';

import ProductList from "@ui/products/productList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";


export default function SearchParamsBasedProductsList(){
    const searchParams = useSearchParams();
    const [sellerId, setSellerId] = useState<number | undefined>(undefined);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const sellerIdParam = searchParams.get("sellerId");
        const validationSchema = z.coerce.number().int().positive({ message: "El ID del producto debe ser un entero positivo" });
        const validatedSellerId = validationSchema.safeParse(sellerIdParam);
        if (validatedSellerId.success) {
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