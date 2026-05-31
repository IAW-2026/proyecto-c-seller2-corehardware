"use client";

import { changeImageLink } from "@/app/lib/actions";
import { useActionState } from "react";

type State ={
    error:string|null,
    success:string|null,
    loading:boolean,
    currentImage:string,
}

export default function changeImageForm({ productId, initialImage }: { productId: string; initialImage: string }) {
  const initialState:State = {
    error : null,
    success: null,
    loading: false,
    currentImage:initialImage,
  }

  const changeImageToProduct = async (prevState:State, formData:FormData) => {
    prevState.error = null;
    prevState.success = null;
    prevState.loading = true;

    try {
        const entries = Object.fromEntries(formData.entries());
        const newImage = entries.newImage as string;
        await changeImageLink(productId, newImage);
        prevState.success= "Imagen actualizada correctamente.";
        prevState.currentImage= newImage;
    } catch (err) {
        prevState.error =err instanceof Error ? err.message : "Error de red. Intenta nuevamente.";
    } finally {
        prevState.loading = false;
        return prevState;
    }   
  };

  const [formState, handleSubmit] = useActionState(changeImageToProduct,initialState);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cambiar Imagen</h2>
      <form action={handleSubmit} className="grid gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nuevo enlace de imagen
          <input
            type="link"
            name="newImage"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          />
        </label>

        <button
          type="submit"
          disabled={formState.loading}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formState.loading ? "Actualizando..." : "Cambiar Imagen"}
        </button>

        {formState.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{formState.error}</p>}
        {formState.success && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">{formState.success}</p>}
      </form>
    </div>
  );
}
