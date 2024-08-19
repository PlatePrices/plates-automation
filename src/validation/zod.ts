import { z } from 'zod';

import { invalidPlatesInfo, Plate } from '../types/plates.js';

const BasePlateSchema = z.object({
  url: z.string().url(),
  number: z.number(),
  source: z.string(),
  image: z.string(),
  price: z.string(),
  character: z.string().max(2),
});

export const DubizzlePlateSchema = BasePlateSchema.extend({
  emirate: z.string(),
});

export const XplateSchema = BasePlateSchema.extend({
  emirate: z.string(),
  duration: z.string(),
});

export const PlatesAeSchema = BasePlateSchema.extend({
  contact: z.string(),
});

export const NumberAeSchema = BasePlateSchema.extend({
  duration: z.string(),
  emirate: z.string(),
});

export const EmiratesAuctionSchema = BasePlateSchema.extend({
  emirate: z.string(),
});

const schemaMap: Record<string, z.ZodTypeAny> = {
  dubizzle: DubizzlePlateSchema,
  xplate: XplateSchema,
  platesae: PlatesAeSchema,
  numberae: NumberAeSchema,
  emiratesauction: EmiratesAuctionSchema,
};

export const validatePlate = (plate: Plate, website: string): invalidPlatesInfo => {
  // this is to ensure that was given is correct and is the schema map
  const schema = schemaMap[website.toLowerCase()] as z.ZodTypeAny | undefined;

  if (!schema) {
    console.error(`No schema found for website: ${website}`);
    return { isValid: false, data: plate };
  }

  const validationResult = schema.safeParse(plate);

  if (validationResult.success) {
    return { isValid: true, data: plate };
  } else {
    console.error(`Validation failed against ${website} schema:`);
    for (const errorMessage of validationResult.error.errors) {
      console.error(`error: ${errorMessage.message}`);
    }
    return { isValid: false, data: plate };
  }
};
