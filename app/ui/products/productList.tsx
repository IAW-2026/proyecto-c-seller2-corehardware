import { getProducts, Product } from "@lib/actions";
import Link from "next/link";


export default async function ProductList() {
    const products: Product[] = await getProducts();
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
                                Borrar
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}