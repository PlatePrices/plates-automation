import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

import { PLATES_AE_SELECTORS } from '../config/plates.config.js';
import logger from '../logger/winston.js';
import { performanceType } from '../types/performance.js';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import database from '../Database/db.js';
import { LEVEL } from '../types/logs.js';
const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];

const fetchPage = async (page: number): Promise<boolean> => {
  const data = `page=${page.toString()}`;
  const headers = PLATES_AE_SELECTORS.HEADERS;

  try {
    const response = await fetch(PLATES_AE_SELECTORS.BASE_URL, {
      method: 'POST',
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status.toString()}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(PLATES_AE_SELECTORS.ALL_PLATES));
    if (plates.length === 0) {
      return false;
    }

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const price = plateElement.find(PLATES_AE_SELECTORS.PRICE).text().trim() || '';
      const url = plateElement.find('a').attr('href') || '';
      const contact = plateElement.find('a').attr('href')?.slice(4, 15) || '';
      const number = plateElement.find(PLATES_AE_SELECTORS.PLATE_NUMBER).text().trim() || '';
      const character = plateElement.find(PLATES_AE_SELECTORS.CHARACTER).text().trim() || '';
      const img = plateElement.find('img').attr('src') || '';

      const newPlate: Plate = {
        url,
        price,
        contact,
        number: parseInt(number),
        character,
        image: img,
        source: PLATES_AE_SELECTORS.SOURCE_NAME,
      };
      const plateValidation = validatePlate(newPlate, PLATES_AE_SELECTORS.SOURCE_NAME);
      if (!plateValidation.isValid) {
        invalidPlates.push(plateValidation.data);
      } else {
        validPlates.push(newPlate);
      }
    });

    return true;
  } catch (error) {
    logger.log(PLATES_AE_SELECTORS.SOURCE_NAME, LEVEL.ERROR, `Error fetching page: ${error}`);
    return false;
  }
};

export const scrapePlatesAePlates = async (): Promise<validAndInvalidPlates> => {
  const startTime = Date.now();

  let page = 0;
  let hasMorePages = true;
  let isCached = false;
  const pagePerformance: performanceType[] = [];

  while (hasMorePages) {
    const batchStartTime = Date.now();

    hasMorePages = await fetchPage(page);

    const batchEndTime = Date.now();
    const batchDurationMs = batchEndTime - batchStartTime;
    const batchDurationSec = batchDurationMs / 1000;

    pagePerformance.push({
      pageNumber: page,
      durationMs: batchDurationMs,
    });

    page++;
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    PLATES_AE_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs,
  );

  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance);

  return { validPlates, invalidPlates };
};
