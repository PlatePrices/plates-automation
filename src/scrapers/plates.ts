import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

import { PLATES_AE_SELECTORS } from '../config/plates.config.js';
import logger from '../logger/winston.js';
import { performanceType } from '../types/performance.js';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import database from '../Database/db.js';
import { LEVEL } from '../types/logs.js';

const DEFAULT_CONCURRENCY = 5;
const MAX_ERRORS = 5;

export const scrapePlatesAePlates = async (
  startPage: number,
  endPage: number,
  concurrencyLimit: number = DEFAULT_CONCURRENCY,
): Promise<validAndInvalidPlates> => {
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();
  let currentPage = startPage;
  let consecutiveErrors = 0;

  const fetchPage = async (pageNumber: number): Promise<boolean> => {
    const data = `page=${pageNumber.toString()}`;
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

      for (const plate of plates) {
        const plateElement = $(plate);
        const price =
          plateElement.find(PLATES_AE_SELECTORS.PRICE).text().trim() || '';
        const url = plateElement.find('a').attr('href') || '';
        const contact = plateElement.find('a').attr('href')?.slice(4, 15) || '';
        const number =
          plateElement.find(PLATES_AE_SELECTORS.PLATE_NUMBER).text().trim() ||
          '';
        const character =
          plateElement.find(PLATES_AE_SELECTORS.CHARACTER).text().trim() || '';
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

        const plateValidation = validatePlate(
          newPlate,
          PLATES_AE_SELECTORS.SOURCE_NAME,
        );
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
        }
      }

      return true;
    } catch (error) {
      logger.log(
        PLATES_AE_SELECTORS.SOURCE_NAME,
        LEVEL.ERROR,
        `Error fetching page ${pageNumber}: ${error}`,
      );
      return false;
    }
  };

  const fetchPagesInBatches = async () => {
    let shouldContinue = true;
    while (shouldContinue && currentPage <= endPage) {
      const batch = Array.from(
        { length: concurrencyLimit },
        (_, i) => currentPage + i,
      );

      const results = await Promise.all(batch.map((page) => fetchPage(page)));

      if (!results.every(Boolean)) {
        shouldContinue = false;
      }

      consecutiveErrors = 0;
      currentPage += concurrencyLimit;

      if (currentPage > endPage) {
        shouldContinue = false;
      }
    }
  };

  await fetchPagesInBatches();

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    PLATES_AE_SELECTORS.SOURCE_NAME,
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
