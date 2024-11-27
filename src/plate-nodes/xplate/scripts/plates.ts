import { getPlatesResponse } from '../requests/plate.request';
import * as cheerio from 'cheerio';
import { plateSchema, PlateSchematype } from '../schemas/plate.schema';
import { SELECTORS } from '../config.js';
export const getPlates = async (startPage: number, endPage: number) => {
  const Plates: PlateSchematype[] = [];
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    const response = await getPlatesResponse(pageNumber);

    const html: string = await response.platesResponse.data;

    const $ = cheerio.load(html);
    if ($(SELECTORS.WARNING_MESSAGE).length) {
      // if there are no plates then skip
      return;
    }

    const plates = Array.from($(SELECTORS.ALL_PLATES));

    if (plates.length === 0) return;

    for (const plate of plates) {
      const plateElement = $(plate);
      const imgSrc = plateElement.find('img').attr('data-src') || '';
      const price = plateElement.find(SELECTORS.PRICE).text().trim() || '';
      const duration =
        plateElement.find(SELECTORS.DURATION).text().trim() || '';
      const url = plateElement.find(SELECTORS.LINK).attr('href') || '';

      const emirateMatch = url.match(/\/(\d+)-(.+?)-code-/);
      const characterMatch = url.match(/-code-(.+?)-plate-number-/);
      const numberMatch = url.match(/plate-number-(\d+)/);

      const emirate = emirateMatch ? emirateMatch[2] : '';
      const character = characterMatch ? characterMatch[1] : '';
      const number = numberMatch ? numberMatch[1] : '';

      const newPlate: PlateSchematype = {
        image: imgSrc,
        price: price,
        duration: duration,
        emirate: emirate,
        source: SELECTORS.SOURCE,
        number: number,
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
