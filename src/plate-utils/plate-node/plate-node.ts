import { z } from 'zod';

import { ALL_PLATES_TYPE, validationResult } from '../../type.js';
import { BasePlateSchemaType } from '../validation/plates.schema';

export default abstract class plateNode {
  public plates!: BasePlateSchemaType[];
  protected validatePlates(
    plates: BasePlateSchemaType[],
    schema: z.ZodType<BasePlateSchemaType>,
  ): {
    validPlates: BasePlateSchemaType[];
    invalidPlates: validationResult;
  } {
    const validPlates: BasePlateSchemaType[] = [];
    const invalidPlates: validationResult = { plates: [], errors: [] };

    for (const plate of plates) {
      const validationResult = schema.safeParse(plate);

      if (validationResult.success) {
        validPlates.push(validationResult.data);
      } else {
        invalidPlates.plates.push(plate);
        invalidPlates.errors.push(validationResult.error);
      }
    }

    return { validPlates, invalidPlates };
  }
  protected abstract parsePlates(
    pageNumber: number,
  ): Promise<cheerio.Root | object | null>;

  protected abstract extractPlates(
    startPage: number,
    endPage: number,
  ): Promise<ALL_PLATES_TYPE>;

  public getPlates() {
    return this.plates;
  }

  // public arePlatesCached(source: string, plates: unknown[]): boolean {
  //   return false;
  // }

  // public setPlatesToCache(source: string, plates: unknown[]): void {}
  // public getPlatesFromCache(source: string): void {}
}
