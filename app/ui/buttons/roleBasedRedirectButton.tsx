"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

export default function RoleBasedRedirectButton() {
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role;
  const isSellerDetailPage = /^\/seller\/[^/]+$/.test(pathname ?? "");

  if (role === "admin" && pathname !== "/dashboard") {
    return (
      <button
        className="rounded-full bg-linear-to-r from-indigo-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.01]"
        onClick={() => router.push("/dashboard")}
      >
        Dashboard de Administración
      </button>
    );
  }

  if (
    role === "seller" &&
    pathname !== "/seller" &&
    !isSellerDetailPage
  ) {
    return (
      <button
        className="rounded-full bg-linear-to-r from-indigo-600 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.01]"
        onClick={() => router.push("/seller")}
      >
        Panel del Vendedor
      </button>
    );
  }

  return null;
}