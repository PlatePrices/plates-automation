import { z } from 'zod';

import logger from '../logger/logger.js';
import { BasePlateSchemaType } from '../validation/plates.schema';
import { validationResult } from '../../type';

export default abstract class plateNode {
  public plates!: BasePlateSchemaType[];
  protected validatePlates(
    plates: BasePlateSchemaType[],
    schema: z.ZodTypeAny,
  ): {
    validPlates: BasePlateSchemaType[];
    invalidPlates: validationResult;
  } {
    if (!schema) {
      logger.error('No schema for validation has been found');
    }

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
  ): Promise<cheerio.Root | object>;

  protected abstract extractPlates(
    startPage: number,
    endPage: number,
  ): Promise<void>;

  public getPlates() {
    return this.plates;
  }

  // public arePlatesCached(source: string, plates: unknown[]): boolean {
  //   return false;
  // }

  // public setPlatesToCache(source: string, plates: unknown[]): void {}
  // public getPlatesFromCache(source: string): void {}
}
