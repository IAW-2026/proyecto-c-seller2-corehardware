"use client";

import { State } from "@lib/actions";
import { useActionState, use } from "react";
import { useSearchParams } from "next/navigation";

type editProductForm ={
    id:number;
    name?: string;
    sellerId?: number;
    brand?: string;
    model?: string;
    price?: number;
    stock?: number;
    description?: string;
    specs?: string;
    warranty?: string;
    image?: string;
}


export default function EditProductForm({params}: {params: Promise<{ id: string }>}) {
    const productId = Number(use(params).id);
    const initialState: State = {
        product: null,
        loading: false,
        errors: null,
    };
    
    const createProductAction = async (previousState: State, formData: FormData) => {
        previousState.loading = true;
        const entries = Object.fromEntries(formData.entries());
        const createProductData: editProductForm = {
            id: productId as number,
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
        <form action={formAction} className="flex flex-col gap-4 w-full">
            <input type="text" name="name" placeholder="Nuevo nombre" className="border p-2 rounded"  />
            <input type="number" name="sellerId" placeholder="ID del nuevo vendedor" className="border p-2 rounded" />
            <input type="text" name="brand" placeholder="Nueva Marca" className="border p-2 rounded"  />
            <input type="text" name="model" placeholder="Nuevo Modelo" className="border p-2 rounded"  />
            <input type="number" step="0.01" name="price" placeholder="Nuevo Precio" className="border p-2 rounded"  />
            <input type="number" name="stock" placeholder="Nuevo Stock" className="border p-2 rounded"  />
            <input type="text" name="description" placeholder="Descripción del producto" className="border p-2 rounded" />
            <input type="text" name="specs" placeholder="Especificaciones" className="border p-2 rounded" />
            <input type="text" name="warranty" placeholder="Garantía" className="border p-2 rounded" />
            <input type="url" name="image" placeholder="URL de la imagen" className="border p-2 rounded" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                {state.loading ? "Editando producto..." : "Editar Producto"}
            </button>
            {state.errors && state.errors.map((error, index) => (
                <p key={index} className="text-red-600">{error}</p>
            ))}
        </form>
    );
    }
 
}

