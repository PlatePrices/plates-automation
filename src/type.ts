import { z } from 'zod';

import { BasePlateSchemaType } from './plate-utils/validation/plates.schema';

export type task = {
  source: string;
  startPage: number;
  endPage: number;
};

export type taskFunction = (
  startPage: number,
  endPage: number,
) => Promise<void>;
export type validationResult = {
  plates: BasePlateSchemaType[];
  errors: z.ZodError[];
};

export type ALL_PLATES_TYPE = {
  validPlates: BasePlateSchemaType[];
  invalidPlates: BasePlateSchemaType[];
};
