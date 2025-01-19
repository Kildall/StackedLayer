
import { z } from "zod";

export const numberFromStringSchema = z.string()
  .transform((val) => {
    // Remove any non-numeric characters except decimal point and negative sign
    const cleaned = val.replace(/[^\d.-]/g, '');
    const parsed = parseInt(cleaned);
    
    // Return NaN if parsing fails or if the string is empty
    if (isNaN(parsed) || cleaned === '') {
      throw new Error('Invalid number format');
    }
    
    return parsed;
  });

export const booleanFromStringSchema = z.string()
  .transform((val) => val === "true");