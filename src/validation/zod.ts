import { z } from 'zod';
import { Plate } from '../types/plates.js';

const BasePlateSchema = z.object({
  url: z.string().url(),
  number: z.number(),
  source: z.string(),
  image: z.string(),
  price: z.string(),
  character: z.string().max(2),
});

const DubizzlePlateSchema = BasePlateSchema.extend({
  emirate: z.string(),
});

const XplateSchema = BasePlateSchema.extend({
  emirate: z.string(),
  duration: z.string(),
});

const PlatesAeSchema = BasePlateSchema.extend({
  contact: z.string(),
});

const NumberAeSchema = BasePlateSchema.extend({
  duration: z.string(),
  emirates: z.string(),
});

const EmiratesAuctionSchema = BasePlateSchema.extend({
  emirate: z.string(),
});

const schemaMap: Record<string, z.ZodTypeAny> = {
  dubizzle: DubizzlePlateSchema,
  xplate: XplateSchema,
  platesae: PlatesAeSchema,
  numberae: NumberAeSchema,
  emiratesauction: EmiratesAuctionSchema,
};

export const validatePlate = (plate: Plate, website: string): boolean => {
  const schema = schemaMap[website.toLowerCase()];

  if (!schema) {
    console.error(`No schema found for website: ${website}`);
    return false;
  }

  const validationResult = schema.safeParse(plate);

  if (validationResult.success) {
    return true;
  } else {
    console.error(`Validation failed against ${website} schema:`);
    for (const errorMessage of validationResult.error.errors) {
      console.error(`error: ${errorMessage.message}`);
    }
    return false;
  }
};
