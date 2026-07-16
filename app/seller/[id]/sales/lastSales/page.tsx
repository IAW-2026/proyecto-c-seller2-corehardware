
import LastSalesReport from "@/app/ui/sales/LastSalesReport";
import SetAmountToShowForm from "@/app/ui/sales/setAmountToShowForm";
import { notFound } from "next/navigation";
import { z } from 'zod';

const coercionSchemaLimit = z.coerce.number().int().positive({ message: "La cantidad de ventas debe ser un entero positivo" });

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export default async function LastSalesSeller({ params, searchParams }: { params:Promise<{ id: string }>, searchParams:SearchParams }) {
    const { id } = await params;
    const amountToShow = (await searchParams)?.amountToShow;
    let validatedAmountToShow:number|null = null;
    if(amountToShow){
        try{
            validatedAmountToShow = coercionSchemaLimit.parse(amountToShow);
        } catch( error ) { notFound();}
    } 

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
            <main className="w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <header className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reporte de Últimas Ventas</h1>
                    <p className="mt-2 text-sm text-zinc-500">Resumen de últimas ventas y detalle por venta.</p>
                </header>
                <section>
                    < SetAmountToShowForm currentAmount={validatedAmountToShow} />
                </section>
                <section>
                    {validatedAmountToShow && <LastSalesReport limit={validatedAmountToShow} sellerId={id} />}
                </section>
            </main>
        </div>
    );
}