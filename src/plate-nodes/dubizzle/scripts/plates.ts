import { SOURCE } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';
import { DubizzleResponseDataType } from '../types.js';

export const getPlates = async (startPage: number, endPage: number) => {
  const Plates: PlateSchematype[] = [];
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    if (platesResponse.status >= 200 && platesResponse.status < 300) return;

    const platesObject = platesResponse.data as DubizzleResponseDataType;

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

      const result = plateSchema.safeParse(newPlate);

      if (!result.success) {
        console.error('Validation failed: ', result.error);
      }

      Plates.push(newPlate);
    }
  }

  return Plates;
};
