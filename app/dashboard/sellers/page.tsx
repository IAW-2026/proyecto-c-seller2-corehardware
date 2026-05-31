'use client';

import SellerList from "@/app/ui/seller/sellerList";

export default function DashboardSellers() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        Páguina de Vendedores
                    </h1>
                    <SellerList />
                </div>
            </main>
        </div>
    );
}