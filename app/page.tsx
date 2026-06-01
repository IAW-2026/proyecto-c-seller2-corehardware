"use client";

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import RoleBasedRedirectButton from '@ui/buttons/roleBasedRedirectButton';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      // Only reload if page was restored from bfcache
      if (e.persisted) {
        window.location.reload();
      }
    };
    
    window.addEventListener('pageshow', handlePageShow as EventListener);
    return () => window.removeEventListener('pageshow', handlePageShow as EventListener);
  }, []);
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
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-full border border-sky-600 bg-white px-6 py-3 text-sm font-semibold text-sky-600 shadow-sm transition hover:bg-sky-50 dark:bg-zinc-900 dark:text-sky-400">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>

                <Show when="signed-in">
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                    <UserButton />
                    <RoleBasedRedirectButton />
                  </div>
                </Show>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-zinc-200 bg-zinc-50 p-8 shadow-lg shadow-zinc-200/30 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Tu tienda al alcance</p>
              <h2 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">Empieza a vender hoy mismo</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Regístrate, conecta tu perfil y gestiona productos en minutos. CoreHardware está listo para ayudarte a crecer.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


