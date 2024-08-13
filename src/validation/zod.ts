import { z } from "zod";
import { Plate } from "../types/plates.js";

const plateSchema = z.object({
  link: z.string().url().optional(),
  img: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  emirate: z.string().optional(),
  character: z.string().max(3).optional(),
  number: z.string().optional(),
  contact: z.string().optional(),
  source: z.string()
});

type ValidatedPlate = z.infer<typeof plateSchema>;

export const validatePlate = (plate: Plate): plate is ValidatedPlate => {
  const validationResult = plateSchema.safeParse(plate);

  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.errors);
    return false;
  }

  return true;
};
