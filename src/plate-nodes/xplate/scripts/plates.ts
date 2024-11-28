import * as cheerio from 'cheerio';

import database from '../../../plate-utils/database/database.js';
import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plate.request';
import { plateSchema, PlateSchematype } from '../schemas/plate.schema';

class Xplate extends plateNode {
  public async parsePlates(pageNumber: number): Promise<cheerio.Root | object> {
    const response = await getPlatesResponse(pageNumber);

    const html: string = (await response.platesResponse.data) as string;

    return cheerio.load(html);
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
      const $ = (await this.parsePlates(pageNumber)) as cheerio.Root;
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
export default new Xplate();
