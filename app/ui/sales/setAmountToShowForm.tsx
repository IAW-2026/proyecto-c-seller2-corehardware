'use client';

import { useActionState } from "react";
import { z } from 'zod';
import { useRouter } from "next/navigation";

type State ={
    error:string|null,
    loading:boolean,
}
const coercionSchemaLimit = z.coerce.number().int().positive({ message: "La cantidad de ventas debe ser un entero positivo" });


export default function SetAmountToShowForm({ currentAmount }: { currentAmount: number|null }) {
    const router = useRouter();

    const initialState:State = {
    error : null,
    loading: false,
  }

  const setAmountToShow = async (prevState:State, formData:FormData) => {
    prevState.error = null;
    prevState.loading = true;
    const entries = Object.fromEntries(formData.entries());
    const amountToShow = entries.amountToShow;
    const validatedAmoutToShow = coercionSchemaLimit.safeParse(amountToShow);
    if(validatedAmoutToShow.success) router.push(`?amountToShow=${validatedAmoutToShow.data}`);
    else prevState.error = validatedAmoutToShow.error.flatten().formErrors[0];
    prevState.loading = false;
    return prevState;
  };

  const [formState, handleSubmit] = useActionState(setAmountToShow,initialState);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cantidad a mostrar</h2>
      <p className="text-sm text-zinc-500 mb-6">Cantidad actual: <span className="font-semibold text-zinc-900 dark:text-white">{currentAmount ? currentAmount : "N/A"}</span></p>
      <form action={handleSubmit} className="grid gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Cantidad a mostrar
          <input
            type="number"
            name="amountToShow"
            min={1}
            defaultValue={1}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          />
        </label>

        <button
          type="submit"
          disabled={formState.loading}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formState.loading ? "Generando Reporte..." : "Generar Reporte"}
        </button>

        {formState.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{formState.error}</p>}
      </form>
    </div>
  );
}
