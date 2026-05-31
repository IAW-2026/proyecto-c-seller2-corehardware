"use client";

import { useUser } from "@clerk/nextjs";

export default function RoleBasedRedirectButton(){
    const { isLoaded, user } = useUser();
    
    if( !isLoaded ) return <div> Cargando datos de Usuario...</div>

    const role = user?.publicMetadata?.role;

    if(role === "admin"){
        return (
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-full shadow-lg hover:scale-[1.01] transition-transform" onClick={() => window.location.href = "/dashboard"}>
            Ir al Dashboard de administración
        </button>
        )
    }

    if(role === "seller"){
        return (
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-full shadow-lg hover:scale-[1.01] transition-transform" onClick={() => window.location.href = "/seller"}>
            Ir a la página de Vendedores
        </button>
        )    
    }
}