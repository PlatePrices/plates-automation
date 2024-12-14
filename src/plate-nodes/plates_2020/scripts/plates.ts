import logger from '../../../plate-utils/logger/logger.js';
import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';
import { plates_2020 } from '../types.js';

class Plates2020 extends plateNode {
  protected async parsePlates(pageNumber: number): Promise<object | null> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const platesObject = platesResponse.data as plates_2020;

    return platesObject;
  }

  public async extractPlates(
    startPage: number,
    endPage: number,
  ): Promise<ALL_PLATES_TYPE> {
    const Plates: PlateSchematype[] = [];

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    const pageResults = await Promise.all(
      pageNumbers.map((pageNumber) =>
        this.parsePlates(pageNumber).catch((err: unknown) => {
          logger.error(
            `Error processing page ${pageNumber.toString()} : `,
            err,
          );
          return null;
        }),
      ),
    );
    for (const platesObject of pageResults) {
      if (!platesObject) continue;

      const plates = (platesObject as plates_2020)['data']['items'];

      if (plates.length === 0) continue;

      for (const plate of plates) {
        const price = plate['price'];
        const number = plate['number'];
        const character = plate['code']['code'];
        const url = /**SELECTORS.SHARABLE_LINK + ['id']*/ '';
        const image = 'NA'; // Replace with actual image if available
        const emirate = plate['code']['city']['name'];
        const contact = plate['editor']['phone'];

        const newPlate: PlateSchematype = {
          url,
          number: number,
          price: price.toString(),
          character: character,
          image,
          emirate,
          source: SELECTORS.SOURCE_NAME,
          contact,
        };

        Plates.push(newPlate);
      }
    }
    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );

    console.log(invalidPlates.errors);

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new Plates2020();
