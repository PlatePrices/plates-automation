import { z } from 'zod';

import { BasePlateSchema } from '../../../plate-utils/validation/plates.schema.js';

export const plateSchema = BasePlateSchema.extend({
  contact: z.string(),
  emirate: z.string(),
  image: z.string(),
});

export type PlateSchematype = z.infer<typeof plateSchema>;
