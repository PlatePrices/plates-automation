import { z } from 'zod';

import logger from '../logger/winston.js';
import { invalidPlatesInfo, Plate } from '../types/plates.js';
import { LEVEL } from '../types/logs.js';


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
  character: z.string().refine((val) => val === 'Red' || val.length <= 2, {
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

const Plates2020Schmea = BasePlateSchema.extend({
  contact: z.string(),
  emirate: z.string(),
  duration: z.string(),
});

const AutoTradersSchema = BasePlateSchema.extend({
  emirate: z.string(),
  number: z.string(),
});

const AlshamilOnlineSchema = BasePlateSchema.extend({
  emirate: z.string(),
  number: z.string(),
});

const dubaiXplatesSchema = BasePlateSchema.extend({
  image: z.string().optional()
})

const schemaMap: Record<string, z.ZodTypeAny> = {
  dubizzle: DubizzlePlateSchema,
  xplate: XplateSchema,
  platesae: PlatesAeSchema,
  numberae: NumberAeSchema,
  emiratesauction: EmiratesAuctionSchema,
  '2020': Plates2020Schmea,
  autotraders: AutoTradersSchema,
  alshamilonline: AlshamilOnlineSchema,
  DUBAI_XPLATES: dubaiXplatesSchema,
};

export const isvalidNumber = (plateNumber: string): boolean => {
  return /^[0-9XYZxyz]+$/.test(plateNumber);
};

export const validatePlate = (plate: Plate, website: string): invalidPlatesInfo => {
  // this is to ensure that was given is correct and is the schema map
  const schema = schemaMap[website.toLowerCase()] as z.ZodTypeAny | undefined;

  if (!schema) {
    logger.log('zod', LEVEL.DEBUG, `No schema found for website: ${website}`);
    return { isValid: false, data: plate };
  }

  const validationResult = schema.safeParse(plate);

  if (validationResult.success) {
    return { isValid: true, data: plate };
  } else {
    logger.log(website, LEVEL.ERROR, `Validation failed against ${website} schema:`);
    for (const errorMessage of validationResult.error.errors) {
      logger.log(website, LEVEL.ERROR, `error: ${errorMessage.message}`);
    }
    return { isValid: false, data: plate };
  }
};
