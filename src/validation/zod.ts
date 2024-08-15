import { z } from 'zod';
import { Plate } from '../types/plates.js';

const basePlateSchema = z.object({
  url: z.string().url(),
  number: z.number(),
  source: z.string(),
  image: z.string(),
  price: z.string(),
  character: z.string().max(2),
});

type BasePlate = z.infer<typeof basePlateSchema>;

const PlatesWithEmirateSchema = basePlateSchema.extend({
  emirate: z.string(),
  duration: z.string(),
});

type PlatesWithEmirate = z.infer<typeof PlatesWithEmirateSchema>;

const PlatesWithContactSchema = basePlateSchema.extend({
  contact: z.string(),
});

type PlatesWithContact = z.infer<typeof PlatesWithContactSchema>;

export const validatePlate = (
  plate: Plate
): plate is BasePlate | PlatesWithEmirate | PlatesWithContact => {
  const baseValidationResult = basePlateSchema.safeParse(plate);

  if (!baseValidationResult.success) {
    console.error(
      'Validation errors in base schema:',
      baseValidationResult.error.errors
    );
    return false;
  }

  const PlatesWithEmirateResult = PlatesWithEmirateSchema.safeParse(plate);
  const PlatesWithContactResult = PlatesWithContactSchema.safeParse(plate);

  if (PlatesWithEmirateResult.success) {
    return true;
  } else if (PlatesWithContactResult.success) {
    return true;
  } else {
    console.error('Validation errors in extended schemas:');

    if (!PlatesWithEmirateResult.success) {
      console.error(
        'Conflict with PlatesWithEmirate schema:',
        PlatesWithEmirateResult.error.errors
      );
    }

    if (!PlatesWithContactResult.success) {
      console.error(
        'Conflict with PlatesWithContact schema:',
        PlatesWithContactResult.error.errors
      );
    }

    return false;
  }
};
