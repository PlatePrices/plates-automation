import fetch from 'node-fetch';
import { CONFIG, DUBIZZLE_SELECTORS } from '../config/dubizzle.config.js';
import logger from '../logger/winston.js';
import { DubizzleResponseData } from '../types/dubizzle.js';
import { performanceType } from '../types/performance.js';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import database from '../Database/db.js';
import { LEVEL } from '../types/logs.js';
const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

const DEFAULT_CONCURRENCY = 5;
const MAX_ERRORS = 5;

const fetchDubizzlePage = async (pageNumber: number): Promise<void> => {
  const pageStartTime = Date.now();
  try {
    const response = await fetch(DUBIZZLE_SELECTORS.URL, CONFIG(pageNumber));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = (await response.json()) as DubizzleResponseData;
    const carPlates = responseData['results'][0]['hits'];

    if (carPlates.length === 0) {
      throw new Error('No plates found on page');
    }

    for (const plate of carPlates) {
      const price = plate['price'];
      const number = Number(plate['details']['Plate number']['ar']['value']);
      const url = plate['absolute_url']['ar'];
      const image = plate['photos']['main'];
      const emirate = plate['site']['en'];
      let character = plate['details']['Plate code']
        ? plate['details']['Plate code']['ar']['value']
        : '';

      if (character.length > 3) {
        character = '';
      }

      const newPlate: Plate = {
        url,
        price: String(price),
        number,
        character,
        image,
        emirate,
        source: DUBIZZLE_SELECTORS.SOURCE_NAME,
      };

      const plateValidation = validatePlate(
        newPlate,
        DUBIZZLE_SELECTORS.SOURCE_NAME,
      );
      if (!plateValidation.isValid) {
        invalidPlates.push(plateValidation.data);
      } else {
        validPlates.push(plateValidation.data);
      }
    }

    const pageEndTime = Date.now();
    const pageDurationMs = pageEndTime - pageStartTime;

    pagePerformance.push({
      pageNumber: pageNumber,
      durationMs: pageDurationMs,
    });
  } catch (error) {
    logger.log(
      DUBIZZLE_SELECTORS.SOURCE_NAME,
      LEVEL.ERROR,
      `Error fetching data for page ${pageNumber}: ${error}`,
    );
    throw error;
  }
};

export const scrapeDubizzlePlates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number = DEFAULT_CONCURRENCY,
): Promise<validAndInvalidPlates> => {
  let currentPage = startPage;
  let consecutiveErrors = 0;
  const startTime = Date.now();
  let shouldContinue = true;

  while (shouldContinue && currentPage <= endPage) {
    try {
      const pagesToScrape = Array.from(
        { length: concurrentRequests },
        (_, i) => currentPage + i,
      );

      await Promise.all(
        pagesToScrape.map((pageNumber) => fetchDubizzlePage(pageNumber)),
      );

      console.log('Scraped pages:', pagesToScrape);

      consecutiveErrors = 0;

      currentPage += concurrentRequests;

      if (currentPage > endPage) {
        shouldContinue = false;
      }
    } catch (error) {
      consecutiveErrors += 1;
      if (consecutiveErrors >= MAX_ERRORS) {
        logger.log(
          DUBIZZLE_SELECTORS.SOURCE_NAME,
          LEVEL.ERROR,
          `Stopping due to ${MAX_ERRORS} consecutive errors.`,
        );
        shouldContinue = false;
      }
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    DUBIZZLE_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs,
  );

  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance,
  );

  return { validPlates, invalidPlates };
};
