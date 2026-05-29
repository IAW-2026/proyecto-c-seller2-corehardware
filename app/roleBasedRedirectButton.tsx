"use client";

import { useUser } from "@clerk/nextjs";

export default function RoleBasedRedirectButton(){
    const { isLoaded, user } = useUser();
    
    if( !isLoaded ) return <div> Cargando datos de Usuario...</div>

    const role = user?.publicMetadata?.role;

    if(role === "admin"){
        return (
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = "/dashboard"}>
            Ir al Dashboard de administración
        </button>
        )
    }

    if(role === "seller"){
        return (
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={() => window.location.href = "/seller"}>
            Ir a la página de Sellers
        </button>
        )    
    }
}