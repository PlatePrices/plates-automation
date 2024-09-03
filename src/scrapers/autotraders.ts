import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Plate } from '../types/plates.js';
import { isvalidNumber, validatePlate } from '../validation/zod.js';
import { performanceType } from '../types/performance.js';
import { AutoTraders_SELECTORS } from '../config/autoTraders.config.js';
import database from '../Database/db.js';
const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];
let finished = false;

const fetchPage = async (pageNumber: number): Promise<void> => {
  const headers = AutoTraders_SELECTORS.CONFIG.HEADERS;
  const pageStartTime = Date.now();
  try {
    const response = await fetch(AutoTraders_SELECTORS.URL(pageNumber), {
      method: 'GET',
      headers,
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(AutoTraders_SELECTORS.ALL_PLATES));
    if (plates.length === 0) {
      finished = true;
      return;
    }

    const mappedPlates = plates.map((plate) => {
      const plateElement = $(plate);
      const link = plateElement.find(AutoTraders_SELECTORS.PLATE_LINK).attr('href') || '';
      const price = plateElement.find(AutoTraders_SELECTORS.PRICE).text().trim() || '';
      const character = link.split('/')[6];
      const emirate = link.split('/')[5];
      const plateNumber = plateElement.find(AutoTraders_SELECTORS.PLATE_NUMBER).text().trim();
      const image = 'NA';

      const newPlate: Plate = {
        image,
        price,
        url: link,
        character,
        number: plateNumber,
        emirate,
        source: AutoTraders_SELECTORS.SOURCE_NAME,
      };

      const plateValidation = validatePlate(newPlate, AutoTraders_SELECTORS.SOURCE_NAME);

      if (!plateValidation.isValid && isvalidNumber(plateNumber)) {
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
        }
      }
    });

    const pageEndTime = Date.now();
    const totalPageTime = pageEndTime - pageStartTime;
    pagePerformance.push({
      pageNumber: pageNumber,
      durationMs: totalPageTime,
    });
    return;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return;
  }
};

export const scrapeAutoTradersPlates = async () => {
  const startTime = Date.now();
  let pageNumber = 1;
  const pagePerformance: performanceType[] = [];

  while (!finished) {
    const pageStartTime = Date.now();
    const plates = await fetchPage(pageNumber);
    const pageEndTime = Date.now();
    const pageDuration = pageEndTime - pageStartTime;

    pageNumber++;
  }

  const endTime = Date.now();
  const totalTimeInMs = endTime - startTime;
  const sourcePerformance = await database.saveSourceOperationPerformance(
    AutoTraders_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalTimeInMs,
  );

  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance)
  return { validPlates, invalidPlates };
};
