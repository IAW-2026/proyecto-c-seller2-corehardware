'use client';

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUser } from "../lib/actions";
import SellerCreationForm from "@ui/seller/sellerCreationForm";

enum SellerStatus { Unchecked, CheckedTrue, CheckedFalse}

export default function SellerPage() {
    const { userId, isLoaded } = useAuth();
    const router = useRouter();
    const [sellerStatus, setSellerStatus] = useState(SellerStatus.Unchecked);

    useEffect(() => {
        async function redirectToSeller(){
            const sellerId = await checkUser( userId ? userId : undefined );
            if( sellerId ){
                setSellerStatus(SellerStatus.CheckedTrue);
                router.push(`/seller/${sellerId}`);
            } else {
                if(isLoaded) setSellerStatus(SellerStatus.CheckedFalse)
            }     
        }
        redirectToSeller();
        
    },[isLoaded]);

    if(!isLoaded){
    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-center">
                Cargando Información de Usuario...
            </h1>
        </div>
    ) } else{
            if(sellerStatus === SellerStatus.CheckedFalse){
                return(
                    <div className="flex flex-col items-center gap-6 mt-8 bg-zinc-40 font-sans dark:bg-black">
                        <h2 className="text-2xl font-bold mb-1">Registra tus datos para vender productos en nuestra tienda</h2>
                            <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                                <SellerCreationForm />  
                           </div>
                           <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = "/"}>
                                Volver a la Páguina Princial
                           </button>  
                    </div>
                ) 
            } else{
                return (
                    <div className="flex items-center justify-center min-h-screen bg-zinc-40 dark:bg-black px-4">
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-center">
                            Redireccionando al Panel de Vendedor...
                        </h1>
                    </div>
                )    
            }
    }
}