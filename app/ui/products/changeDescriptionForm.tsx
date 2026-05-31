"use client";

import { changeDescription } from "@/app/lib/actions";
import { useActionState } from "react";

type State ={
    error:string|null,
    success:string|null,
    loading:boolean,
    currentDescription:string,
}

export default function changeDescriptionForm({ productId, initialDescription }: { productId: string; initialDescription: string }) {
  const initialState:State = {
    error : null,
    success: null,
    loading: false,
    currentDescription:initialDescription,
  }

  const changeDescriptionToProduct = async (prevState:State, formData:FormData) => {
    prevState.error = null;
    prevState.success = null;
    prevState.loading = true;

    try {
        const entries = Object.fromEntries(formData.entries());
        const newDescription = entries.newDescription as string;
        await changeDescription(productId,newDescription);
        prevState.success= "Descripción actualizada correctamente.";
        prevState.currentDescription= newDescription;
    } catch (err) {
        prevState.error =err instanceof Error ? err.message : "Error de red. Intenta nuevamente.";
    } finally {
        prevState.loading = false;
        return prevState;
    }   
  };

  const [formState, handleSubmit] = useActionState(changeDescriptionToProduct,initialState);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cambiar Descripción</h2>
      <form action={handleSubmit} className="grid gap-4">
          <textarea
            name="newDescription"
            defaultValue={"Nueva descripción"}
            className="w-full h-32 p-3 text-left align-top resize-none border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          />
        <button
          type="submit"
          disabled={formState.loading}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-2 text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formState.loading ? "Actualizando..." : "Cambiar Descripción"}
        </button>

        {formState.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{formState.error}</p>}
        {formState.success && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">{formState.success}</p>}
      </form>
    </div>
  );
}
