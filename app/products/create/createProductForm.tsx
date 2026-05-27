"use client";

import { State } from "@lib/actions";
import { useActionState } from "react";

type createProductForm ={
    name: string;
    sellerId?: number;
    brand: string;
    model: string;
    price: number;
    stock: number;
}


export default function CreateProductForm() {
    const initialState: State = {
        product: null,
        loading: false,
        errors: null,
    };
    
    const createProductAction = async (previousState: State, formData: FormData) => {
        previousState.loading = true;
        const entries = Object.fromEntries(formData.entries());
        const createProductData: createProductForm = {
            name: entries.name as string,
            sellerId: entries.sellerId ? Number(entries.sellerId) : undefined,
            brand: entries.brand as string,
            model: entries.model as string,
            price: entries.price ? Number(entries.price) : 0.00,
            stock: entries.stock ? Number(entries.stock) : 0,
        };
        const product = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
            },
            body: JSON.stringify(createProductData),
        }).then((res) => res.json());
        if(product.errors || product.message){
            return {
                ...previousState,
                loading: false,
                errors: product.errors ? Object.values(product.errors).flat() : (product.message ? [product.message] : null),
            }
        } else {
            return {
                ...previousState,
                loading: false,
                product: product,
            }
        }
    }

    const [state, formAction] = useActionState(createProductAction, initialState); 

    if(state.product) {
        return (
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                <h1 className="text-3xl font-bold mb-4">Producto Creado Exitosamente!</h1>
                <p>Nombre: {state.product.name}</p>
                <p>Seller ID: {state.product.sellerId}</p>
                <p>Marca: {state.product.brand}</p>
                <p>Modelo: {state.product.model}</p>
                <p>Precio: ${state.product.price}</p>
                <p>Stock: {state.product.stock}</p>
            </div>
        );
    }
    else{
    return (
        <form action={formAction} className="flex flex-col gap-4 w-full">
            <input type="text" name="name" placeholder="Nombre del producto" className="border p-2 rounded" required />
            <input type="number" name="sellerId" placeholder="Seller ID" className="border p-2 rounded" />
            <input type="text" name="brand" placeholder="Marca" className="border p-2 rounded" required />
            <input type="text" name="model" placeholder="Modelo" className="border p-2 rounded" required />
            <input type="number" step="0.01" name="price" placeholder="0.00" className="border p-2 rounded" required />
            <input type="number" name="stock" placeholder="0" className="border p-2 rounded" required />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                {state.loading ? "Creando..." : "Crear Producto"}
            </button>
            {state.errors && state.errors.map((error, index) => (
                <p key={index} className="text-red-600">{error}</p>
            ))}
        </form>
    );
    }
 
}
