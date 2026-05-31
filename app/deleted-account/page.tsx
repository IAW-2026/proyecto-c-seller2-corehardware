

export default function DeletedAccount() {
    return (
        <div className="flex flex-col items-center bg-zinc-10 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-40 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-4 text-center  ">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                        Te extrañaremos, tu cuenta ha sido eliminada exitosamente.
                    </h1>
                </div>
            </main>
        </div>
    );
}