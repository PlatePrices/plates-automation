import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Plate } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { performanceType } from '../types/performance.js';
import { NUMBERS_AE_SELECTORS } from '../config/numberAe.config.js';
import { savingLogs } from '../utils/saveLogs.js';

const carPlates: Plate[] = [];

const fetchPage = async (pageNumber: number): Promise<Plate[]> => {
  const headers = NUMBERS_AE_SELECTORS.HEADERS;

  try {
    const response = await fetch(NUMBERS_AE_SELECTORS.URL(pageNumber), {
      method: 'GET',
      headers,
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(NUMBERS_AE_SELECTORS.ALL_PLATES));

    const validPlates = plates.map((plate) => {
      const plateElement = $(plate);
      const price =
        plateElement.find(NUMBERS_AE_SELECTORS.PRICE).text().trim() || '';
      const link =
        plateElement.find(NUMBERS_AE_SELECTORS.LINK).attr('href') || '';
      const img = plateElement.find('img').attr('src') || '';
      const altText = plateElement.find('img').attr('alt') || '';

      const altTextPart = altText.split('number ')[1];
      const character = altTextPart.charAt(0);
      const plateNumber = parseInt(altTextPart.split(' ')[1]);
      const duration = plateElement.find('.posted').text().trim();
      const emirate = altText.split('Plate')[0].trim();

      const newPlate: Plate = {
        image: NUMBERS_AE_SELECTORS.SHARABLE_LINK + img,
        price: price,
        url: NUMBERS_AE_SELECTORS.SHARABLE_LINK + link,
        character,
        number: plateNumber,
        duration,
        emirate,
        source: NUMBERS_AE_SELECTORS.SOURCE_NAME,
      };

      const isItValidPlate = validatePlate(newPlate);

      if (isItValidPlate) {
        return newPlate;
      }
    });

    return validPlates as Plate[];
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
};

export const numbersRunner = async () => {
  const startTime = Date.now();

  let pageNumber = 0;
  let stop = false;
  const pagePerformance: performanceType[] = [];

  /**
   * The idea in here is:
   * there are some pages that has same plates nearly so my idea is just to scan each 10 pages and check if they exist or not
   * and so on so fourth
   */
  while (!stop) {
    const batchPlates: Plate[] = [];

    const batchStartTime = Date.now();

    for (let i = 0; i < 10; i++) {
      const pagePlates = await fetchPage(pageNumber);
      batchPlates.push(...pagePlates);
      pageNumber++;
    }

    const batchEndTime = Date.now();
    const batchDurationMs = batchEndTime - batchStartTime;
    const batchDurationSec = batchDurationMs / 1000;

    pagePerformance.push({
      pageNumber,
      durationMs: batchDurationMs,
      durationSec: batchDurationSec,
    });

    const allExist = batchPlates.every((newPlate) =>
      carPlates.some(
        (plate) =>
          plate.character === newPlate.character &&
          plate.number === newPlate.number
      )
    );

    if (!allExist) {
      carPlates.push(
        ...batchPlates.filter(
          (newPlate) =>
            !carPlates.some(
              (plate) =>
                plate.character === newPlate.character &&
                plate.number === newPlate.number
            )
        )
      );
    } else {
      stop = true;
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const performanceRecord = new ScraperPerformance({
    scraperName: NUMBERS_AE_SELECTORS.SOURCE_NAME,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    pagePerformance,
  });

  await savingLogs(
    performanceRecord.startTime,
    performanceRecord.totalDurationMs,
    NUMBERS_AE_SELECTORS.SOURCE_NAME
  );

  await performanceRecord.save();

  return carPlates;
};
