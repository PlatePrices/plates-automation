import { z } from 'zod';

export const BasePlateSchema = z.object({
  source: z.string(),
  price: z.string(),
  number: z.string(),
  url: z.string().url(),
  character: z.string().max(1),
});

export type BasePlateSchemaType = z.infer<typeof BasePlateSchema>;
