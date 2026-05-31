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
        }, [sellerId]);
    
  
        return (
            <div>
               { !isLoaded && (<h1 className="text-3xl font-bold mb-4"> Cargando productos...</h1>)}  
               { isLoaded && (<ProductList onDashboard={true} sellerId={sellerId} />)}
            </div> 
        )
    }