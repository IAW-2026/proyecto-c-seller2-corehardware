'use client';
import { getSellerNamesIds, SellerNameId } from "@lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProductList() {
    const [sellers, setSellers] = useState<SellerNameId[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageLimit = 10; 
    useEffect(() => {
        const fetchSellers = async () => {
            const fetchedSellers = await getSellerNamesIds();
            setSellers(fetchedSellers);
            setLoading(false);
        };
        fetchSellers();
    }, [page]);
    if(loading) return( <h1 className="text-3xl font-bold mb-4"> Cargando vendedores...</h1> )
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Lista de Vendedores</h1>
            <ul>
                {sellers.map((seller) => (
                    <li key={seller.id} className="border p-4 mb-2 rounded">
                        <h2 className="text-xl font-semibold">{seller.name}</h2>
                        <Link href={`/dashboard/sellers/${seller.id}`}>
                            <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-700 transition-colors">
                                Ver Detalles
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
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
                    disabled={sellers.length === 0}
                >
                    Siguiente página
                </button>
            </div>
        </div>
    );
}
                    