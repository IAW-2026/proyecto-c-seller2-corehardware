"use client";

import { createProduct, State} from "@lib/actions";
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
        error: null,
    };
    
    const createProductAction = async (previousState: State, formData: FormData) => {
        try {
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
            const product = await createProduct(createProductData);
            previousState.product = product;
            previousState.error = null;
        } catch (error: any) {
            previousState.error = error.message || "An error occurred while creating the product.";
        } finally {
            previousState.loading = false;
            return previousState;
        }
    }

    const [state, formAction] = useActionState(createProductAction, initialState); 

    if(state.product) {
        return (
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                <h1 className="text-3xl font-bold mb-4">Product Created Successfully!</h1>
                <p>Name: {state.product.name}</p>
                <p>Seller ID: {state.product.sellerId}</p>
                <p>Brand: {state.product.brand}</p>
                <p>Model: {state.product.model}</p>
                <p>Price: ${state.product.price}</p>
                <p>Stock: {state.product.stock}</p>
            </div>
        );
    }
    else{
    return (
        <form action={formAction} className="flex flex-col gap-4 w-full">
            <input type="text" name="name" placeholder="Product Name" className="border p-2 rounded" required />
            <input type="number" name="sellerId" placeholder="Seller ID" className="border p-2 rounded" />
            <input type="text" name="brand" placeholder="Brand" className="border p-2 rounded" required />
            <input type="text" name="model" placeholder="Model" className="border p-2 rounded" required />
            <input type="number" step="0.01" name="price" placeholder="Price" className="border p-2 rounded" required />
            <input type="number" name="stock" placeholder="Stock" className="border p-2 rounded" required />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                {state.loading ? "Creating..." : "Create Product"}
            </button>
            {state.error && <p className="text-red-600">{state.error}</p>}
        </form>
    );
    }
 
}
