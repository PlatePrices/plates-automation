import { z } from 'zod';

import { BasePlateSchema } from '../../../plate-utils/validation/plates.schema';

export const plateSchema = BasePlateSchema.extend({
  emirate: z.string(),
  image: z.string(),
});

export type PlateSchematype = z.infer<typeof plateSchema>;
