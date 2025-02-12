import fetch from 'node-fetch';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { performanceType } from '../types/performance.js';
import { PLATES_2020_SELECTORS } from '../config/2020.config.js';
import { validatePlate } from '../validation/zod.js';
import database from '../Database/db.js';
import { plates_2020 } from '../types/plates_2020.js';
import logger from '../logger/winston.js';
import { LEVEL } from '../types/logs.js';

const DEFAULT_CONCURRENCY = 5; // Number of pages to fetch concurrently
const MAX_ERRORS = 5; // Stop if consecutive errors reach this limit

export const scrapePlates_2020 = async (
  concurrencyLimit: number = DEFAULT_CONCURRENCY,
): Promise<validAndInvalidPlates> => {
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();
  let currentPage = 1;
  let consecutiveErrors = 0;

  // Function to fetch a single page of data
  const fetchPage = async (pageNumber: number): Promise<boolean> => {
    try {
      const pageStartTime = Date.now();

      const response = await fetch(
        PLATES_2020_SELECTORS.GET_URL(pageNumber),
        PLATES_2020_SELECTORS.GET_REQUEST_OPTIONS() as any,
      );

      const responseData = (await response.json()) as plates_2020;
      const carPlates = responseData['data']['items'];

      if (carPlates.length === 0) {
        return false; // No more plates found
      }

      for (const carPlate of carPlates) {
        const price = carPlate['price'];
        const number = carPlate['number'];
        const character = carPlate['code']['code'];
        const url = PLATES_2020_SELECTORS.SHARABLE_LINK + ['id'];
        const image = 'NA'; // Replace with actual image if available
        const emirate = carPlate['code']['city']['name'];
        const contact = carPlate['editor']['phone'];

        const newPlate: Plate = {
          url,
          number: parseInt(number),
          price: price.toString(),
          character: character,
          image,
          emirate,
          source: PLATES_2020_SELECTORS.SOURCE_NAME,
          contact,
        };

        const plateValidation = validatePlate(
          newPlate,
          PLATES_2020_SELECTORS.SOURCE_NAME,
        );
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
        }
      }

      const pageEndTime = Date.now();
      const pageTotalTimeInMs = pageEndTime - pageStartTime;
      pagePerformance.push({
        pageNumber,
        durationMs: pageTotalTimeInMs,
      });

      return true;
    } catch (error) {
      logger.log(
        PLATES_2020_SELECTORS.SOURCE_NAME,
        LEVEL.ERROR,
        `Error fetching page ${pageNumber}: ${error}`,
      );
      return false; // Return false on error
    }
  };

  // Function to run page fetchers in batches with a concurrency limit
  const fetchPagesInBatches = async () => {
    while (true) {
      const batch = Array.from(
        { length: concurrencyLimit },
        (_, i) => currentPage + i,
      );

      // Run all page fetchers concurrently
      console.log(batch);
      const results = await Promise.all(batch.map((page) => fetchPage(page)));

      // Check if any page returned no data
      if (!results.every(Boolean)) {
        break; // Exit loop if any page returns no data
      }

      // Reset consecutive errors after a successful batch
      consecutiveErrors = 0;
      currentPage += concurrencyLimit; // Move to the next batch
    }
  };

  // Start fetching pages in batches with concurrency
  await fetchPagesInBatches();

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    PLATES_2020_SELECTORS.SOURCE_NAME,
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
