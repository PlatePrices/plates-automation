import * as cheerion from 'cheerio';

import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.requests.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';

export const getPlates = async (startPage: number, endPage: number) => {
  const Plates: PlateSchematype[] = [];
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = (await platesResponse.data) as string;

    if (!html)
      throw new Error(`No HTML returned for page : ${pageNumber.toString()}`);

    const $ = cheerion.load(html);

    const plates = Array.from($(SELECTORS.ALL_PLATES));

    if (plates.length === 0) return;

    for (const plate of plates) {
      const plateElement = $(plate);
      const number = plateElement.find(SELECTORS.PLATE_NUMBER).text();

      const price = plateElement.find(SELECTORS.PLATE_PRICE).text();
      const emirate = plateElement.find(SELECTORS.PLATE_SOUCE).text();
      const character = plateElement.find(SELECTORS.PLATE_CHARACTER).text();

      const href = plateElement
        .find(SELECTORS.PLATE_URL)
        .attr('href') as string;
      const url = SELECTORS.SHARABLE_LINK.concat(href);

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
