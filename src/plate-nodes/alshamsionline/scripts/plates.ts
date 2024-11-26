import * as cheerio from 'cheerio';

import { getPlatesResponse } from '../requests/plates.requests';
import { SELECTORS } from '../config';
import { PlateSchematype } from '../schemas/plates.schema';

export const getPlates = async (startPage: number, endPage: number) => {
  const Plates: PlateSchematype[] = [];
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    const { platesResponse } = await getPlatesResponse(pageNumber);

    const html = await platesResponse.data;

    if (!html) throw new Error(`No html returned for page : ${pageNumber}`);

    const $ = cheerio.load(html);

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
      const duration = plateElement.find($(SELECTORS.DATE)).text().trim() || '';
      let emirate = 'NA';

      if (character.length < 3) {
        emirate = info.slice(2, info.length - 2).join(' ');
      } else {
        character = '?';
        emirate = info.slice(2, info.length - 3).join(' ');
      }

      const image = plateElement.find(SELECTORS.IMAGE).attr('data-src') || 'NA';

      const newPlate = {
        image,
        price,
        url: link,
        character,
        number,
        emirate,
        source: 'alshamsionline',
        duration,
      };

      Plates.push(newPlate);
    }
  }
  return Plates;
};
