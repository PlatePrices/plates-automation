import * as cheerion from 'cheerio';

import logger from '../../../plate-utils/logger/logger.js';
import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { ALL_PLATES_TYPE } from '../../../type.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.requests.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';

class DubaiXplates extends plateNode {
  public async parsePlates(pageNumber: number): Promise<cheerio.Root | null> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = (await platesResponse.data) as string;

    if (!html)
      throw new Error(`No HTML returned for page : ${pageNumber.toString()}`);

    return cheerion.load(html);
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

    for (const $ of pageResults) {
      if (!$) continue;

      const plates = Array.from($(SELECTORS.ALL_PLATES));

      if (plates.length === 0) continue;
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

    for (
      let pageNumber: number = startPage;
      pageNumber <= endPage;
      pageNumber++
    ) {
      const $ = (await this.parsePlates(pageNumber)) as cheerio.Root;
      const plates = Array.from($(SELECTORS.ALL_PLATES));

      if (plates.length === 0) continue;
    }
    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new DubaiXplates();
