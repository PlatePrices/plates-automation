import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Plate } from '../types/plates.js';
import { isvalidNumber, validatePlate } from '../validation/zod.js';
import { performanceType } from '../types/performance.js';
import { AL_SHAMIL_SELECTORS } from '../config/alshamilonline.config.js';
import database from '../Database/db.js';
const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];
let finished = false;

const fetchPage = async (pageNumber: number): Promise<void> => {
  const headers = AL_SHAMIL_SELECTORS.HEADERS;
  const pageStartTime = Date.now();
  try {
    const response = await fetch(AL_SHAMIL_SELECTORS.URL(pageNumber), {
      method: 'GET',
      headers,
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const plates = Array.from($(AL_SHAMIL_SELECTORS.ALL_PLATES).children());
    if (plates.length < 99) {
      finished = true;
    }
    const mappedPlates = plates.map((plate) => {
      const plateElement = $(plate);
      const linkElement = plateElement.find(AL_SHAMIL_SELECTORS.PLATE_LINK);
      const isSold = linkElement.find('button').text().trim() || '';
      if (isSold === 'Sold' || isSold === 'Booked') return;
      const link = linkElement.attr('href') || '';
      const info = link.split('-');
      if (info[1].split('/')[1] === 'bike') return;
      let price = plateElement.find(AL_SHAMIL_SELECTORS.PRICE).text().trim() || '';
      if (price === '' || price === 'AED' || price === '0' || price === 'AED 0') return;
      if (price != 'Call for price') price = price.split(' ')[1].replace(/[^0-9]/g, '');
      let character = info[info.length - 2];
      const number = info[info.length - 1].split('_')[0];
      const duration = plateElement.find($(AL_SHAMIL_SELECTORS.DATE)).text().trim() || '';

      let emirate = '';
      if (character.length < 3) {
        if (info.length === 5) emirate = info[2];
        else if (info.length === 6) emirate = info[2] + ' ' + info[3];
        else if (info.length === 7) emirate = info[2] + ' ' + info[3] + ' ' + info[4];
        else if (info.length === 4) emirate = info[1].split('/')[1];
        else {
          emirate = 'NA';
          console.log(
            'Price:',
            price,
            'Character:',
            character,
            'Number:',
            number,
            'Emirate:',
            emirate,
            'Link:',
            link,
            'Duration:',
            duration,
          );
        }
      } else {
        if (info.length === 4) {
          emirate = info[2];
          character = '?';
        } else if (info.length === 5) {
          emirate = info[2] + ' ' + info[3];
          character = '??';
        } else if (info.length === 6) {
          emirate = info[2] + ' ' + info[3] + ' ' + info[4];
          character = '?';
        }
      }
      const image = plateElement.find(AL_SHAMIL_SELECTORS.IMAGE).attr('data-src') || 'NA';

      const newPlate: Plate = {
        image: 'image',
        price,
        url: link,
        character,
        number,
        emirate: emirate,
        source: AL_SHAMIL_SELECTORS.SOURCE_NAME,
        duration,
      };
      const plateValidation = validatePlate(newPlate, AL_SHAMIL_SELECTORS.SOURCE_NAME);

      if (plateValidation.isValid && isvalidNumber(number)) {
        validPlates.push(newPlate);
      } else {
        invalidPlates.push(plateValidation.data);
      }
    });

    const pageEndTime = Date.now();
    const pageDurationInMs = pageEndTime - pageStartTime;
    pagePerformance.push({
      pageNumber,
      durationMs: pageDurationInMs,
    });
    return;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}`, error);
    return;
  }
};

export const scrapealshamsionlinePlates = async () => {
  const startTime = Date.now();
  let pageNumber = 1;
  const pagePerformance: performanceType[] = [];

  while (!finished) {
    const pageStartTime = Date.now();
    await fetchPage(pageNumber);
    const pageEndTime = Date.now();
    const pageDuration = pageEndTime - pageStartTime;

    pageNumber++;
  }

  const endtime = Date.now();
  const totalDurationMs = endtime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    AL_SHAMIL_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endtime),
    totalDurationMs,
  );
  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance);

  return { validPlates, invalidPlates };
};
