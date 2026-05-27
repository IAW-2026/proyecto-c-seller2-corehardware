"use client";
import { getProducts, Product } from "@lib/actions";
import { useEffect, useState } from "react";


export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        async function fetchProducts() {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        }
        fetchProducts();
    }, []);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="border p-4 mb-2 rounded">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p>Brand: {product.brand}</p>
                        <p>Model: {product.model}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Seller ID: {product.sellerId}</p>
                        <p>isDeleted: {product.isDeleted ? "Yes" : "No"}</p>
                        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-700 transition-colors">
                            Edit
                        </button>
                        <button className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-red-700 transition-colors">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}