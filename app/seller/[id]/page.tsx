
import Link from "next/link";
import { getSellerName } from "@lib/actions";



export default async function PersonalizedSellerPage( {params}: {params: Promise<{ id: string }>}){
    const {id} =await params;
    const sellerName = await getSellerName(id);

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-4xl font-bold text-blue-500 mb-8">Bienvenido, {sellerName}</h1>
                    <Link href={`/seller/${id}/products/`}>
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">Gestionar Productos</button>
                    </Link>
                </div>
            </main>
        </div>
    );
}