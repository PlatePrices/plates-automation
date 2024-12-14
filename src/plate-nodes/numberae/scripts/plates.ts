import * as cheerio from 'cheerio';

import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';

class NumberAe extends plateNode {
  protected async parsePlates(
    pageNumber: number,
  ): Promise<cheerio.Root | null> {
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
        const link = plateElement.find(SELECTORS.LINK).attr('href') || '';
        const img = plateElement.find('img').attr('src') || '';
        const altText = plateElement.find('img').attr('alt') || '';

        const afterPlateNumber = altText
          .split('Plate number')[1]
          .trim()
          .split('for sale')[0]
          .split(' ');

        const plateNumber =
          afterPlateNumber.length > 2
            ? afterPlateNumber[1].trim()
            : afterPlateNumber[0].trim();

        const character =
          afterPlateNumber.length > 2 ? afterPlateNumber[0].trim() : '';

        const duration = plateElement.find('.posted').text().trim();
        const emirate = altText.split('Plate')[0].trim();

        const newPlate: PlateSchematype = {
          image: SELECTORS.SHARABLE_LINK + img,
          price: price,
          url: SELECTORS.SHARABLE_LINK + link,
          character,
          number: plateNumber,
          duration,
          emirate,
          source: SELECTORS.SOURCE_NAME,
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

export default new NumberAe();
