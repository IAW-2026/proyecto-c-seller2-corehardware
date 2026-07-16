
import SellerList from "@/app/ui/seller/sellerList";
import { getSellerCount, getSellerNamesIds, SellerNameId } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import z from "zod";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>




export default async function DashboardSellers({ searchParams }: { searchParams:SearchParams }) {
    const page = (await searchParams)?.page;
    const limit = 10;
    let validatedPage: number = 1;
    const coercionSchemaLimit = z.coerce.number().int().positive({ message: "El número de páguina debe ser un entero positivo" }).optional();
    const pageValidation = coercionSchemaLimit.safeParse(page);
    if( ! pageValidation.success) notFound();
    else validatedPage = pageValidation.data || 1;
    let sellerCount = 0;
    let sellers:SellerNameId[] = []
    try{
    sellerCount = await getSellerCount();
    sellers = await getSellerNamesIds(limit,validatedPage);
    } catch( err ) { 
        console.log(err);
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black py-12">
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                <section className="rounded-4xl border border-zinc-200 bg-white/95 p-8 shadow-2xl shadow-zinc-200/30 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="flex flex-col gap-8 text-center sm:text-left">
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Gestión de vendedores</p>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Página de Vendedores</h1>
                            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                Revisa y administra los vendedores registrados. Encuentra detalles, historial y estado de cada cuenta.
                            </p>
                        </div>
                        <SellerList page={validatedPage} sellerCount={sellerCount} sellers={sellers}/>
                    </div>
                </section>
            </main>
        </div>
    );
}