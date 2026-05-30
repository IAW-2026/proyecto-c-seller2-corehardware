"use client";

import { State } from "@lib/actions";
import { useActionState } from "react";



export default function EditProductForm({params}: {params: Promise<{ id: string }>}) {
    const initialState: State = {
        product: null,
        loading: false,
        errors: null,
    };
    
    const createProductAction = async (previousState: State, formData: FormData) => {
        previousState.loading = true;
        const entries = Object.fromEntries(formData.entries());
        const createProductData = {
            id: (await params).id,
            name: entries.name ? entries.name as string : undefined,
            sellerId: entries.sellerId ? Number(entries.sellerId) : undefined,
            brand: entries.brand ? entries.brand as string : undefined,
            model: entries.model ? entries.model as string : undefined,
            price: entries.price ? Number(entries.price) : undefined,
            stock: entries.stock ? Number(entries.stock) : undefined,
            description: entries.description ? entries.description as string : undefined,
            specs: entries.specs ? entries.specs as string : undefined,
            warranty: entries.warranty ? entries.warranty as string : undefined,
            image: entries.image ? entries.image as string : undefined,
        };
        const product = await fetch("/api/products", {
            method: "PUT",
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
                <h1 className="text-3xl font-bold mb-4">Producto Editado Exitosamente!</h1>
                <p>Nombre: {state.product.name}</p>
                <p>ID del Vendedor: {state.product.sellerId}</p>
                <p>Marca: {state.product.brand}</p>
                <p>Modelo: {state.product.model}</p>
                <p>Precio: ${state.product.price}</p>
                <p>Stock: {state.product.stock}</p>
                <p>Descripción: {state.product.description}</p>
                <p>Especificaciones: {state.product.specs}</p>
                <p>Garantía: {state.product.warranty}</p>
                <p>URL de la Imagen: {state.product.imageUrl}</p>
            </div>
        );
    }
    else{
    return (
        <form action={formAction} className="grid grid-cols-2 gap-4 w-full max-w-5xl">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-lg font-medium">Nombre</label>
                <input id="name" type="text" name="name" placeholder="Nombre del producto" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="sellerId" className="text-lg font-medium">ID del vendedor</label>
                <input id="sellerId" type="number" name="sellerId" placeholder="ID del vendedor" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="text-lg font-medium">Marca</label>
                <input id="brand" type="text" name="brand" placeholder="Marca" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="model" className="text-lg font-medium">Modelo</label>
                <input id="model" type="text" name="model" placeholder="Modelo" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-lg font-medium">Precio</label>
                <input id="price" type="number" step="0.01" name="price" placeholder="0.00" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="stock" className="text-lg font-medium">Stock</label>
                <input id="stock" type="number" name="stock" placeholder="0" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-lg font-medium">Descripción</label>
                <input id="description" type="text" name="description" placeholder="Descripción del producto" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="specs" className="text-lg font-medium">Especificaciones</label>
                <input id="specs" type="text" name="specs" placeholder="Especificaciones" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="warranty" className="text-lg font-medium">Garantía</label>
                <input id="warranty" type="text" name="warranty" placeholder="Garantía" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="image" className="text-lg font-medium">Imagen</label>
                <input id="image" type="url" name="image" placeholder="URL de la imagen" className="w-full border px-4 py-2 rounded text-lg" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
                <button type="submit" className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-lg">
                    {state.loading ? "Editando..." : "Editar Producto"}
                </button>
                {state.errors && state.errors.map((error, index) => (
                    <p key={index} className="text-red-600">{error}</p>
                ))}
            </div>
        </form>
    );
    }
 
}

