import { z } from 'zod';

import { BasePlateSchema } from '../../../plate-utils/validation/plates.schema';

export const plateSchema = BasePlateSchema.extend({
  image: z.string(),
  duration: z.string(),
  emirate: z.string(),
});

export type PlateSchematype = z.infer<typeof plateSchema>;
