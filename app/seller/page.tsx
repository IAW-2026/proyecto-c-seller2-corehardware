'use client';

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUser } from "../lib/actions";
import SellerCreationForm from "@ui/seller/sellerCreationForm";

export default function SellerPage() {
    const { userId, isLoaded } = useAuth();
    const router = useRouter();
    const [isCheckingSeller, setIsCheckingSeller] = useState(true);
    const [hasSeller, setHasSeller] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        if (!userId) {
            setIsCheckingSeller(false);
            setHasSeller(false);
            return;
        }

        const currentUserId = userId;
        let isCancelled = false;

        async function redirectToSeller(attempt = 0) {
            try {
                const sellerId = await checkUser(currentUserId);
                if (isCancelled) {
                    return;
                }

                if (sellerId) {
                    const targetPath = `/seller/${sellerId}`;
                    setHasSeller(true);
                    setIsCheckingSeller(false);
                    router.replace(targetPath);
                    window.location.assign(targetPath);
                    return;
                }

                if (attempt < 2) {
                    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
                    if (!isCancelled) {
                        await redirectToSeller(attempt + 1);
                        return;
                    }
                }
            } catch (error) {
                console.error("Error al verificar el vendedor del usuario:", error);
            }

            if (!isCancelled) {
                setHasSeller(false);
                setIsCheckingSeller(false);
            }
        }

        void redirectToSeller();

        return () => {
            isCancelled = true;
        };
    }, [isLoaded, userId, router]);

    if (!isLoaded || isCheckingSeller) {
        return (
            <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12 flex items-center justify-center px-4">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                    Redireccionando al panel de vendedor...
                </h1>
            </div>
        );
    }

    if (hasSeller === false || !userId) {
        return (
            <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
                <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
                    <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Vendedor</p>
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Registra tus datos
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                    Completa el formulario para comenzar a vender productos en nuestra tienda.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <SellerCreationForm />
                                <button className="rounded-3xl bg-linear-to-r from-zinc-600 to-gray-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-500/20 transition hover:from-zinc-700 hover:to-gray-700 w-full sm:w-auto" onClick={() => window.location.href = "/"}>
                                    Volver a la Página Principal
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return null;
}