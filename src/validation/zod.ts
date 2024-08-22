import { z } from 'zod';

import logger from '../logger/winston.js';
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
  character: z.string().refine((val) => val === "Red" || val.length <= 2, {
    message: "Character must be 'Red' or have a maximum length of 2 characters",
  }),
});

export const XplateSchema = BasePlateSchema.extend({
  emirate: z.string(),
  duration: z.string(),
});

export const PlatesAeSchema = BasePlateSchema.extend({
  contact: z.string(),
});

// I put the number as string in here since there are numbers string with x or any character indicating that the number has not been chosen yet
export const NumberAeSchema = BasePlateSchema.extend({
  duration: z.string(),
  emirate: z.string(),
  number: z.string(),
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
    logger.error(`No schema found for website: ${website}`);
    return { isValid: false, data: plate };
  }

  const validationResult = schema.safeParse(plate);

  if (validationResult.success) {
    return { isValid: true, data: plate };
  } else {
    logger.error(`Validation failed against ${website} schema:`);
    for (const errorMessage of validationResult.error.errors) {
      logger.error(`error: ${errorMessage.message}`);
    }
    return { isValid: false, data: plate };
  }
};
