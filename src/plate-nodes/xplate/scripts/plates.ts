import * as cheerio from 'cheerio';

import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plate.request.js';
import { plateSchema, PlateSchematype } from '../schemas/plate.schema.js';

class Xplate extends plateNode {
  async parsePlates(pageNumber: number): Promise<cheerio.Root | null> {
    try {
      const { platesResponse } = await getPlatesResponse(pageNumber);
      const html = (await platesResponse.data) as string;

      if (!html) {
        throw new Error(`No HTML returned for page: ${pageNumber.toString()}`);
      }

      return cheerio.load(html);
    } catch (error) {
      console.error(`Failed to parse page ${pageNumber.toString()}:`, error);
      return null;
    }
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

    const batchSize = 10;

    for (let i = 0; i < pageNumbers.length; i += batchSize) {
      const batch = pageNumbers.slice(i, i + batchSize);
      console.log('Processing batch: ', batch);
      const pageResults = await Promise.all(
        batch.map((pageNumber) =>
          this.parsePlates(pageNumber).catch((err: unknown) => {
            console.error(
              `Error processing page ${pageNumber.toString()}:`,
              err,
            );
            return null;
          }),
        ),
      );

      for (const $ of pageResults) {
        if (!$) continue;

        const plates = Array.from($(SELECTORS.ALL_PLATES));
        console.log('plates length : ', plates.length);
        if (plates.length === 0) continue;

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

          Plates.push({
            image: imgSrc,
            price,
            duration,
            emirate,
            source: SELECTORS.SOURCE,
            number,
            character,
            url,
          });
        }
      }
    }

    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new Xplate();
