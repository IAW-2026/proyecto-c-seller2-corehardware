import SalesReportByPeriod from "@/app/ui/sales/SalesReportByPeriod";
import SetPeriodForm from "@/app/ui/sales/setPeriodForm";
import { notFound } from "next/navigation";
import { LocaleStartDateSchema, getLocaleEndDateSchema} from "@/app/lib/utils";



type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export default async function SalesByPeriod({ searchParams }: { searchParams:SearchParams }) {
    const startDate = (await searchParams)?.startDate;
    const endDate = (await searchParams)?.endDate;
    let validatedStartDate:string | null = null;
    let validatedEndDate:string | null = null;
    let validatedStartDateLocale: string | null = null;
    let validatedEndDateLocale: string | null = null;
    if(startDate && endDate){
        try{
            const validStartDate = LocaleStartDateSchema.parse(startDate);
            validatedStartDate = validStartDate.toISOString();
            validatedStartDateLocale = validStartDate.toLocaleDateString();
            const coercionSchemaEndDate = getLocaleEndDateSchema(validStartDate);
            const validEndDate = coercionSchemaEndDate.parse(endDate);
            validatedEndDate = validEndDate.toISOString();
            validatedEndDateLocale = validEndDate.toLocaleDateString();
        } catch( error ) { notFound();}
    } 

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
            <main className="w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <header className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reporte de Ventas por período</h1>
                    <p className="mt-2 text-sm text-zinc-500">Resumen de ventas por período y detalle por venta.</p>
                </header>
                <section>
                    < SetPeriodForm currentStartDate={validatedStartDateLocale} currentEndDate={validatedEndDateLocale} />
                </section>
                <section>
                    {validatedStartDate && validatedEndDate && <SalesReportByPeriod startDate={validatedStartDate} endDate={validatedEndDate}/> }
                </section>
            </main>
        </div>
    );
}