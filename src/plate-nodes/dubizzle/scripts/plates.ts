import database from '../../../plate-utils/database/database.js';
import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { SOURCE } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';
import { DubizzleResponseDataType } from '../types.js';

class Plates extends plateNode {
  public async parsePlates(pageNumber: number): Promise<cheerio.Root | object> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    if (platesResponse.status >= 200 && platesResponse.status < 300)
      throw new Error('Error in parsing');

    const platesObject = platesResponse.data as DubizzleResponseDataType;

    return platesObject;
  }

  public async extractPlates(
    startPage: number,
    endPage: number,
  ): Promise<void> {
    const Plates: PlateSchematype[] = [];

    for (
      let pageNumber: number = startPage;
      pageNumber <= endPage;
      pageNumber++
    ) {
      const platesObject = (await this.parsePlates(
        pageNumber,
      )) as DubizzleResponseDataType;
      const plates = platesObject['results'][0]['hits'];

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
          number,
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
    this.plates = validPlates;
    await database.addPlates(validPlates, invalidPlates.plates);
  }
}

export default new Plates();
