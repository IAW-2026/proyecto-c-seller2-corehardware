
import { getSalesOnPeriod, getTotalSalesValueOnPeriod, SaleDetails } from "@lib/actions";


export default async function SalesReportByPeriod( { startDate, endDate, sellerId = undefined }: { startDate: string, endDate: string, sellerId?: string }) {
        const sales: SaleDetails[] = sellerId ? await getSalesOnPeriod(startDate, endDate,sellerId) : await getSalesOnPeriod(startDate,endDate);
        const totalSalesValue: string = sellerId ? await getTotalSalesValueOnPeriod(startDate, endDate, sellerId) : await getTotalSalesValueOnPeriod(startDate, endDate);        
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-sm text-zinc-500">Valor Total de Ventas</h2>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{totalSalesValue}</p>
            </div>

            <div className="grid gap-4">
                {sales.map((sale) => (
                    <article key={sale.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Venta #{sale.id}</h3>
                                <p className="mt-1 text-sm text-zinc-500">{sale.sellerName} • {sale.date.toLocaleDateString()}</p>

                                <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                                    <strong>Total: </strong>
                                    <span className="font-medium">{sale.totalPrice}</span>
                                </div>

                                <div className="mt-3">
                                    <h4 className="text-sm text-zinc-500 mb-2">Productos</h4>
                                    <div className="max-h-28 overflow-auto rounded-md border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700 whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                        {sale.products}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}