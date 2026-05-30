"use client";

import EditProductForm from "@ui/products/editProductForm";


export default function Home({params}: {params: Promise<{ id: string }>}) {
    return (
        <div className="flex flex-col items-center bg-zinc-10 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-2 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-4 text-center  ">
                    <EditProductForm params= {params} />  
                    <button className="px-35 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = "/dashboard/products"}>
                        Volver a Productos
                    </button>  
                </div>
            </main>
        </div>
    );    

}