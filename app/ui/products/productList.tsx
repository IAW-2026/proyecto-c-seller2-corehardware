'use client';
import { getProducts, Product } from "@lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProductList({sellerId = undefined, onDashboard = false}: {sellerId?: number, onDashboard?: boolean}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageLimit = (sellerId) ? 10 : 5; 
    useEffect(() => {
        const fetchProducts = async () => {
            const fetchedProducts = await getProducts(pageLimit, page, sellerId);
            setProducts(fetchedProducts);
            setLoading(false);
        };
        fetchProducts();
    }, [page]);
    if(loading) return( <h1 className="text-3xl font-bold mb-4"> Cargando productos...</h1> )
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Lista de Productos</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="border p-4 mb-2 rounded">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p>Marca: {product.brand}</p>
                        <p>Modelo: {product.model}</p>
                        <p>Precio: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        { onDashboard && (
                            <>
                                <p>ID del Vendedor: {product.sellerId}</p>
                                <p>Descripción: {product.description}</p>
                                <p>Especificaciones: {product.specs}</p>
                                <p>Garantía: {product.warranty}</p>
                                <p>URL de la Imagen: {product.imageUrl}</p>
                                <Link href={`/dashboard/products/${product.id}/edit`}>
                                    <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-700 transition-colors">
                                        Editar
                                    </button>
                                </Link>
                                <Link href={`/dashboard/products/${product.id}/delete`}>
                                    <button className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-red-700 transition-colors">
                                        Eliminar
                                    </button>
                                </Link>
                            </>
                        )}
                        {sellerId && (
                            <Link href={`/seller/${sellerId}/products/${product.id}`}>
                                <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-700 transition-colors">
                                    Ver Detalles
                                </button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
            { products.length === 0 && (
                <h2 className="text-2xl font-bold mb-4">No hay más productos para mostrar</h2>
            ) }
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    disabled={page === 1}
                >
                    Página anterior
                </button>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    disabled={products.length === 0}
                >
                    Siguiente página
                </button>
            </div>
        </div>
    );
}