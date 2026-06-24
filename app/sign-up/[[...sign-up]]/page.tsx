"use client";

import { RedirectToSignUp, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export default function Page(){
    const router = useRouter();
    const [userChecked, setUserChecked] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    
      useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;
    
        const role = user.publicMetadata?.role;
    
        if (role === 'admin') {
          router.replace('/dashboard');
          return;
        }
    
        if (role === 'seller') {
          router.replace('/seller');
        }

        setUserChecked(true);
      }, [isLoaded, isSignedIn, router, user]);

    if (!isLoaded) {
    return null;
    }

    const role = user?.publicMetadata?.role;

    if (isSignedIn && (role === 'admin' || role === 'seller')) {
        return null;
    }
    
    if(isLoaded && userChecked && !isSignedIn)  return <RedirectToSignUp />
      else {
        if(isSignedIn && role !== 'admin' && role!=='seller'){
                return (
                    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
                        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6">
                            <section className="rounded-4xl border border-zinc-200 bg-white/95 p-10 shadow-2xl shadow-zinc-200/40 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                                <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
                                    <div className="space-y-6">
                                        <div className="space-y-3 text-center sm:text-left">
                                            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Bienvenido a CoreHardware</p>
                                            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                                                Vende mejor y mantén tu inventario siempre actualizado.
                                            </h1>
                                            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                                Administra productos, controla ventas y actualiza tu cuenta desde una interfaz moderna y fácil de usar.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                                            <p className="max-w-xl text-base leading-7 text-red-600 dark:text-red-400"> Usted está logueado con un usuario de la webapp incorrecta, cierre sesión e ingrese con un usuario de esta webapp </p>
                                            < UserButton />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>                
                )
            }
        }

}