import logger from '../../../plate-utils/logger/logger.js';
import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SOURCE } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';
import { DubizzleResponseDataType } from '../types.js';

class Plates extends plateNode {
  public async parsePlates(pageNumber: number): Promise<object | null> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const platesObject = platesResponse.data as DubizzleResponseDataType;

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

      const plates = (platesObject as DubizzleResponseDataType)['results'][0][
        'hits'
      ];
      if (plates.length === 0) throw new Error('No Plates found on page');
      for (const plate of plates) {
        const price = plate['price'];
        const number = plate['details']['Plate number']['ar']['value'];
        const url = plate['absolute_url']['ar'];
        const image = plate['photos']['main'];
        const emirate = plate['site']['en'];
        const character = plate.details['Plate code']?.ar.value ?? 'N/A';

        const newPlate: PlateSchematype = {
          url,
          price: String(price),
          number: number.toString(),
          character,
          image,
          emirate,
          source: SOURCE,
        };
        Plates.push(newPlate);
      }
    }

    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );

    console.log('error : ', invalidPlates.errors);

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new Plates();
