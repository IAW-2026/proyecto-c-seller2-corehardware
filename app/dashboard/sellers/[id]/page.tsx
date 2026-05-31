import { getSellerDetails } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function DashboardPersonalizedSellerPage( {params}: {params: Promise<{ id: string }>}){
    try{
    const {id} =await params;
    const sellerDetails = await getSellerDetails(id);
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                    <h1 className="text-3xl font-bold"> {sellerDetails.name} </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Email: {sellerDetails.email}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Teléfono: {sellerDetails.phoneNumber}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Dirección: {sellerDetails.address}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">CUIT: {sellerDetails.CUIT}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Inicio de actividades: {new Date(sellerDetails.startOfActivities).toLocaleDateString()}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Condición frente al IVA: {sellerDetails.VATCondition}</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = `/dashboard/products?sellerId=${id}`}>
                        Gestionar Productos
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = "/dashboard/sellers"}>
                        Volver a Vendedores
                    </button>
                </div>
            </main>
        </div>
    );
    } catch(err){
        notFound();
    }
}