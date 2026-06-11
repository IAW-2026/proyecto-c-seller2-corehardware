'use client';
import { SellerNameId } from "@lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function SellerList( {page, sellers,sellerCount}:{page:number,sellers:SellerNameId[],sellerCount:number}) {
    const router = useRouter();
    const pageLimit = 10; 

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Lista de Vendedores</h1>
            <ul className="grid gap-4">
                {sellers.map((seller) => (
                    <li key={seller.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div>
                            <h2 className="text-lg font-semibold">{seller.name}</h2>
                        </div>
                        <div>
                            <Link href={`/dashboard/sellers/${seller.id}`}>
                                <button className="px-4 py-2 bg-linear-to-r from-rose-500 to-red-500 text-white rounded-full shadow">
                                    Ver Detalles
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            { sellers.length === 0 && (
                <div className="text-center py-8"><p className="text-sm text-zinc-600 dark:text-zinc-400">No hay más vendedores para mostrar</p></div>
            ) }
            { sellerCount > pageLimit &&(
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => router.push( `?page=${Math.max(page - 1, 1)}`)}
                    className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-800 disabled:opacity-40"
                    disabled={page === 1}
                >
                    Página anterior
                </button>
                <button
                    onClick={() => router.push(`?page=${page+1}`)}
                    className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-800 disabled:opacity-40"
                    disabled={sellers.length === 0}
                >
                    Siguiente página
                </button>
            </div>
            )}
        </div>
    );
}
                    