"use client";

import { State } from "@lib/actions";
import { useActionState } from "react";

type createProductForm ={
    name: string;
    sellerId: string;
    brand: string;
    model: string;
    price: number;
    stock: number;
    specs: string;
    warranty: string;
    description: string;
    image: string;
}


export default function CreateProductForm({sellerId = undefined}: {sellerId?: string}) {
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
            sellerId: sellerId || (entries.sellerId as string),
            brand: entries.brand as string,
            model: entries.model as string,
            price: entries.price ? Number(entries.price) : 0.00,
            stock: entries.stock ? Number(entries.stock) : 0,
            description: entries.description as string,
            specs: entries.specs as string,
            warranty: entries.warranty as string,
            image: entries.image as string,
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
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h1 className="text-2xl font-bold mb-2">Producto Creado</h1>
                <p className="text-sm text-zinc-600">{state.product.name} — <span className="font-medium">${state.product.price}</span></p>
                <div className="mt-4 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <div>ID del Vendedor: {state.product.sellerId}</div>
                    <div>Marca: {state.product.brand}</div>
                    <div>Modelo: {state.product.model}</div>
                    <div>Stock: {state.product.stock}</div>
                    <div>Descripción: {state.product.description}</div>
                </div>
            </div>
        );
    }
    else{
    return (
        <form action={formAction} className="grid grid-cols-2 gap-6 w-full max-w-5xl bg-white rounded-xl p-6 shadow-sm dark:bg-zinc-950">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nombre</label>
                <input id="name" type="text" name="name" placeholder="Nombre del producto" className="w-full border border-zinc-200 px-4 py-2 rounded-lg shadow-sm bg-transparent" required />
            </div>
                {!sellerId && (
            <div className="flex flex-col gap-2">
                <label htmlFor="sellerId" className="text-lg font-medium">ID del vendedor</label>
                <input id="sellerId" type="text" name="sellerId" placeholder="ID del vendedor" className="w-full border px-4 py-2 rounded text-lg" required />
            </div> ) }
            <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="text-lg font-medium">Marca</label>
                <input id="brand" type="text" name="brand" placeholder="Marca" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="model" className="text-lg font-medium">Modelo</label>
                <input id="model" type="text" name="model" placeholder="Modelo" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-lg font-medium">Precio</label>
                <input id="price" type="number" step="0.01" name="price" placeholder="0.00" className="no-spinner w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="stock" className="text-lg font-medium">Stock</label>
                <input id="stock" type="number" name="stock" placeholder="0" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-lg font-medium">Descripción</label>
                <input id="description" type="text" name="description" placeholder="Descripción del producto" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="specs" className="text-lg font-medium">Especificaciones</label>
                <input id="specs" type="text" name="specs" placeholder="Especificaciones" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="warranty" className="text-lg font-medium">Garantía</label>
                <input id="warranty" type="text" name="warranty" placeholder="Garantía" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="image" className="text-lg font-medium">Imagen</label>
                <input id="image" type="url" name="image" placeholder="URL de la imagen" className="w-full border px-4 py-2 rounded text-lg" required />
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
                <button type="submit" className="px-5 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow hover:opacity-95 text-lg">
                    {state.loading ? "Creando..." : "Crear Producto"}
                </button>
                {state.errors && state.errors.map((error, index) => (
                    <p key={index} className="text-red-600">{error}</p>
                ))}
            </div>
        </form>
    );
    }

}
