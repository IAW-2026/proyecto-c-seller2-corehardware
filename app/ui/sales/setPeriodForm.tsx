'use client';

import { useActionState } from "react";
import { z } from 'zod';
import { useRouter } from "next/navigation";

type State ={
    errors:string[]|null,
    loading:boolean,
}


export default function SetPeriodForm({ currentStartDate, currentEndDate }: { currentStartDate: string|null, currentEndDate:string|null }) {
    const router = useRouter();

    const initialState:State = {
    errors : null,
    loading: false,
  }

  const setPeriod = async (prevState:State, formData:FormData) => {
    prevState.errors = null;
    prevState.loading = true;
    const entries = Object.fromEntries(formData.entries());
    let errors: string[]|null = null;
    const startDateSchema = z.coerce.date({ message: "La fecha debe ser una fecha válida" });
    const validatedStartDate = startDateSchema.safeParse(entries.startDate);
    if(!validatedStartDate.success) errors = validatedStartDate.error.flatten().formErrors;
    const endDateSchema = validatedStartDate.success? z.coerce.date({ message: "La fecha debe ser una fecha válida" }).min(validatedStartDate.data, { message: "La fecha de fin debe ser posterior a la fecha de inicio" }) : z.coerce.date({ message: "La fecha debe ser una fecha válida" });
    const validatedEndDate = endDateSchema.safeParse(entries.endDate);
    if(!validatedEndDate.success){
      if(errors) errors.concat(validatedEndDate.error.flatten().formErrors);
      else errors = validatedEndDate.error.flatten().formErrors;
    }
    if(validatedStartDate.success && validatedEndDate.success) router.push(`?startDate=${validatedStartDate.data.toLocaleDateString()}` + `&endDate=${validatedEndDate.data.toLocaleDateString()}`);
    prevState.errors = errors;
    prevState.loading = false;
    return prevState;
  };

  const [formState, handleSubmit] = useActionState(setPeriod,initialState);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Período considerado</h2>
      <p className="text-sm text-zinc-500 mb-6">Fecha inicio actual: <span className="font-semibold text-zinc-900 dark:text-white">{currentStartDate ? currentStartDate : "N/A"}</span></p>
      <p className="text-sm text-zinc-500 mb-6">Fecha fin actual: <span className="font-semibold text-zinc-900 dark:text-white">{currentEndDate ? currentEndDate : "N/A"}</span></p>
      <form action={handleSubmit} className="grid gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Fecha inicio
          <input
            type="date"
            name="startDate"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Fecha fin
          <input
            type="date"
            name="endDate"
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

        {formState.errors && formState.errors.map((error, index) => <p key={index} className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{ error }</p>)}
      </form>
    </div>
  );
}
