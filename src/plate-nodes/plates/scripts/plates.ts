import * as cheerio from 'cheerio';

import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema';

class PlateAe extends plateNode {
  async parsePlates(pageNumber: number): Promise<cheerio.Root | null> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = (await platesResponse.data) as string;

    if (!html) {
      throw new Error(`No HTML returned for page: ${pageNumber.toString()}`);
    }

    return cheerio.load(html);
  }

  async extractPlates(
    startPage: number,
    endPage: number,
  ): Promise<ALL_PLATES_TYPE> {
    const Plates: PlateSchematype[] = [];

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    // Fetch all pages in parallel
    const pageResults = await Promise.all(
      pageNumbers.map((pageNumber) =>
        this.parsePlates(pageNumber).catch((err: unknown) => {
          console.error(`Error processing page ${pageNumber.toString()}:`, err);
          return null;
        }),
      ),
    );

    for (const $ of pageResults) {
      if (!$) continue;

      const plates = Array.from($(SELECTORS.ALL_PLATES));

      if (plates.length === 0) continue;

      for (const plate of plates) {
        const plateElement = $(plate);
        const price = plateElement.find(SELECTORS.PRICE).text().trim() || '';
        const url = plateElement.find('a').attr('href') || '';
        const contact = plateElement.find('a').attr('href')?.slice(4, 15) || '';
        const number =
          plateElement.find(SELECTORS.PLATE_NUMBER).text().trim() || '';
        const character =
          plateElement.find(SELECTORS.CHARACTER).text().trim() || '';
        const img = plateElement.find('img').attr('src') || '';

        const newPlate: PlateSchematype = {
          url,
          price,
          contact,
          number: number,
          character,
          image: img,
          source: SELECTORS.SOURCE,
        };

        Plates.push(newPlate);
      }
    }

    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new PlateAe();
