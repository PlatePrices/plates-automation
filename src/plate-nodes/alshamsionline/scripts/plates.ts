import * as cheerio from 'cheerio';

import plateNode from '../../../plate-utils/plate-node/plate-node.js';
import { SELECTORS } from '../config.js';
import { getPlatesResponse } from '../requests/plates.requests.js';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema.js';

class Alshamsionline extends plateNode {
  async parsePlates(pageNumber: number): Promise<cheerio.Root | null> {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = (await platesResponse.data) as string;

    if (!html)
      throw new Error(`No html returned for page : ${pageNumber.toString()}`);

    return cheerio.load(html);
  }

  async extractPlates(startPage: number, endPage: number) {
    const Plates: PlateSchematype[] = [];

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    const pageResults = await Promise.all(
      pageNumbers.map((pageNumber) =>
        this.parsePlates(pageNumber).catch((err: unknown) => {
          console.error(`Failed to fetch page ${pageNumber.toString()}:`, err);
          return null;
        }),
      ),
    );

    for (const $ of pageResults) {
      if (!$) continue;

      const plates = Array.from($(SELECTORS.ALL_PLATES));

      if (plates.length === 0) continue;

      for (const plate of plates) {
        const plateElement = $($(plate));
        const linkElement = plateElement.find(SELECTORS.PLATE_LINK);
        const isSold = linkElement.find('button').text().trim() || '';
        if (isSold === 'Sold' || isSold === 'Booked') continue;

        const link = linkElement.attr('href') || '';
        const info = link.split('-');
        if (info[1].split('/')[1] === 'bike') continue;

        let price = plateElement.find(SELECTORS.PRICE).text().trim() || '';
        if (!price || price === 'AED 0') continue;
        price =
          price !== 'Call for price'
            ? price.split(' ')[1].replace(/[^0-9]/g, '')
            : price;
        price = '';

        let character = info[info.length - 2];
        const number = info[info.length - 1].split('_')[0];
        const duration =
          plateElement.find($(SELECTORS.DATE)).text().trim() || '';
        let emirate = 'NA';

        if (character.length < 3) {
          emirate = info.slice(2, info.length - 2).join(' ');
        } else {
          character = '?';
          emirate = info.slice(2, info.length - 3).join(' ');
        }

        const image =
          plateElement.find(SELECTORS.IMAGE).attr('data-src') || 'NA';

        const newPlate = {
          image,
          price,
          url: link,
          character,
          number,
          emirate,
          source: SELECTORS.SOURCE,
          duration,
        };

        Plates.push(newPlate);
      }
    }

    const { validPlates, invalidPlates } = super.validatePlates(
      Plates,
      plateSchema,
    );
    this.plates = validPlates;

    return { validPlates: validPlates, invalidPlates: invalidPlates.plates };
  }
}

export default new Alshamsionline();
