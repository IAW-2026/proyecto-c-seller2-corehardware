export default async function PersonalizedProductPage( {params}: {params: Promise<{ id: string , productId: string}>}){
    const {id, productId} =await params;

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <p> Páguina de detalle del producto con id : {productId} del vendedor con id : {id} </p>
                </div>
            </main>
        </div>
    );
}