import * as cheerio from 'cheerio';

import { getPlatesResponse } from '../requests/plates.requests';
import { SELECTORS } from '../config';
import { plateSchema, PlateSchematype } from '../schemas/plates.schema';
import plateNode from '../../../plate-utils/plate-node/plate-node';
import { RequestyBody } from '../../../plate-utils/plate-node/types';
import database from '../../../plate-utils/database/database';
import { BasePlateSchemaType } from '../../../plate-utils/validation/plates.schema';
class Alshamsionline extends plateNode {
  public async parsePlates(pageNumber: number) {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = await platesResponse.data;

    if (!html) throw new Error(`No html returned for page : ${pageNumber}`);

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
      const $ = await this.parsePlates(pageNumber);

      const plates = Array.from($(SELECTORS.ALL_PLATES));

      if (plates.length === 0) return;

      for (const plate of plates) {
        const plateElement = $(plate);
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
    await database.addPlates(validPlates, invalidPlates.plates);
  }
}

export default new Alshamsionline();
