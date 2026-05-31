"use client";

import { useState, useEffect} from "react";
import { Product } from "@/app/lib/actions";

export default function DeleteProduct({params}: {params: Promise<{ id: string }>}) {
    const emptyProduct: Product = {
        id : 0,
        sellerId : 0,
        name : "",
        brand : "",
        model : "",
        stock : 0,
        price : "",
        specs : "",
        warranty : "",
        imageUrl : "",
        description : "",
    }
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(emptyProduct);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        const deleteProduct = async () => {
            const deletedProduct = await fetch("/api/products", {
                method: "Delete",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
                },
                body: JSON.stringify({ id: (await params).id}),
            }).then((res) => res.json());
            if(deletedProduct.message){
                setErrorMessage(deletedProduct.message);
                setLoading(false);
            }
            else{
                setProduct(deletedProduct);
                setLoading(false);
            }    
            }       
            deleteProduct();
    },[])
    if(loading) return( <h1 className="text-3xl font-bold mb-4"> Pedido en proceso...</h1> )
    else{
    if(errorMessage!=="") return( <p className="text-red-600"> Error: {errorMessage}. Con ID de producto: {product.id} </p> )
    else 
        return(
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h1 className="text-2xl font-bold mb-2">Producto Eliminado</h1>
                <p className="text-sm text-zinc-600">{product.name} — <span className="font-medium">${product.price}</span></p>
                <div className="mt-4 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <div>Id del Vendedor: {product.sellerId}</div>
                    <div>Marca: {product.brand}</div>
                    <div>Modelo: {product.model}</div>
                    <div>Stock: {product.stock}</div>
                </div>
            </div>
        )
    }
}