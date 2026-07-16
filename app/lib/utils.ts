import { z } from 'zod';
import { parse, isValid, isAfter} from 'date-fns';

export const LocaleStartDateSchema = z.string().transform(parseLocaleStartDate);

export function getLocaleEndDateSchema(startDate:Date){
   return z.string().transform(parseLocaleEndDate(startDate));   
}


function parseLocaleStartDate (val:string, ctx:z.core.$RefinementCtx<string>) {
  const parsedDate = parse(val, 'dd/MM/yyyy', new Date());
  
  if (!isValid(parsedDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La fecha debe ser una fecha válida",
    });
    return z.NEVER;
  }
  
  return parsedDate;
}

function parseLocaleEndDate (startDate:Date) {
    return (val:string, ctx:z.core.$RefinementCtx<string>) =>{    
    const parsedDate = parse(val, 'dd/MM/yyyy', new Date());
    
    if (!isValid(parsedDate)) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha debe ser una fecha válida",
        });
        return z.NEVER;
    }

    if (!isAfter(parsedDate, startDate)) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
        return z.NEVER;
    }
    
    return parsedDate;
    }
}


