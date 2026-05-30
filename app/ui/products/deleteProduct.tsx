"use client";

import { useState, useEffect, use } from "react";
import { Product } from "@/app/lib/actions";

export default function DeleteProduct({params}: {params: Promise<{ id: string }>}) {
    const productId = Number(use(params).id);
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
                body: JSON.stringify({ id: productId}),
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
    if(errorMessage!=="") return( <p className="text-red-600"> Error: {errorMessage}. Con ID de producto: {productId} </p> )
    else 
        return(
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                <h1 className="text-3xl font-bold mb-4">Producto Eliminado Exitosamente!</h1>
                <p>Nombre: {product.name}</p>
                <p>Id del Vendedor: {product.sellerId}</p>
                <p>Marca: {product.brand}</p>
                <p>Modelo: {product.model}</p>
                <p>Precio: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Descripción: {product.description}</p>
                <p>Especificaciones: {product.specs}</p>
                <p>Garantía: {product.warranty}</p>
                <p>URL de la Imagen: {product.imageUrl}</p>
            </div>
        )
    }
}