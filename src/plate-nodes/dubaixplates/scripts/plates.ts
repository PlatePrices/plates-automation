import * as cheerion from 'cheerio';

import { getPlatesResponse } from '../requests/plates.requests.js';

import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';
import { SELECTORS } from '../config.js';
export const getPlates = async (startPage: number, endPage: number) => {
  const Plates: PlateSchematype[] = [];
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = await platesResponse.data;

    if (!html) throw new Error(`No HTML returned for page : ${pageNumber}`);

    const $ = cheerion.load(html);

    const plates = Array.from($(SELECTORS.ALL_PLATES));

    if (plates.length === 0) return;

    for (const plate of plates) {
      const plateElement = $(plate);
      const number = plateElement.find(SELECTORS.PLATE_NUMBER).text();

      const price = plateElement.find(SELECTORS.PLATE_PRICE).text();
      const emirate = plateElement.find(SELECTORS.PLATE_SOUCE).text();
      const character = plateElement.find(SELECTORS.PLATE_CHARACTER).text();

      const url =
        SELECTORS.SHARABLE_LINK +
        plateElement.find(SELECTORS.PLATE_URL).attr('href');

      const newPlate: PlateSchematype = {
        source: 'dubaixplate',
        number: number,
        price: price,
        emirate: emirate,
        character: character,
        url: url,
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
