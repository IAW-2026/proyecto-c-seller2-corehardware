import Link from "next/link";
import ProductList from "./productList";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        CoreHardware Paguina de Productos
                    </h1>
                    <ProductList />
                    <Link href="/products/create">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Crear Producto
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

