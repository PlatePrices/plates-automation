import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { isvalidNumber, validatePlate } from '../validation/zod.js';
import database from '../Database/db.js';
import { performanceType } from '../types/performance.js';
import { AL_SHAMIL_SELECTORS } from '../config/alshamilonline.config.js';
import logger from '../logger/winston.js';
import { LEVEL } from '../types/logs.js';

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

const DEFAULT_CONCURRENCY = 5;
const MAX_ERRORS = 5;

let finished = false;

const fetchAlShamilPage = async (pageNumber: number): Promise<void> => {
  const pageStartTime = Date.now();
  const headers = AL_SHAMIL_SELECTORS.HEADERS;

  try {
    const response = await fetch(AL_SHAMIL_SELECTORS.URL(pageNumber), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const plates = Array.from($(AL_SHAMIL_SELECTORS.ALL_PLATES).children());

    if (plates.length < 99) {
      finished = true;
    }

    for (const plate of plates) {
      const plateElement = $(plate);
      const linkElement = plateElement.find(AL_SHAMIL_SELECTORS.PLATE_LINK);
      const isSold = linkElement.find('button').text().trim() || '';
      if (isSold === 'Sold' || isSold === 'Booked') continue;

      const link = linkElement.attr('href') || '';
      const info = link.split('-');
      if (info[1].split('/')[1] === 'bike') continue;

      let price =
        plateElement.find(AL_SHAMIL_SELECTORS.PRICE).text().trim() || '';
      if (!price || price === 'AED 0') continue;
      price =
        price !== 'Call for price'
          ? price.split(' ')[1].replace(/[^0-9]/g, '')
          : price;
      price = '';

      let character = info[info.length - 2];
      const number = info[info.length - 1].split('_')[0];
      const duration =
        plateElement.find($(AL_SHAMIL_SELECTORS.DATE)).text().trim() || '';
      let emirate = 'NA';

      if (character.length < 3) {
        emirate = info.slice(2, info.length - 2).join(' ');
      } else {
        character = '?';
        emirate = info.slice(2, info.length - 3).join(' ');
      }

      const image =
        plateElement.find(AL_SHAMIL_SELECTORS.IMAGE).attr('data-src') || 'NA';

      const newPlate: Plate = {
        image,
        price,
        url: link,
        character,
        number,
        emirate,
        source: AL_SHAMIL_SELECTORS.SOURCE_NAME,
        duration,
      };

      const plateValidation = validatePlate(
        newPlate,
        AL_SHAMIL_SELECTORS.SOURCE_NAME,
      );

      if (plateValidation.isValid && isvalidNumber(number)) {
        validPlates.push(plateValidation.data);
      } else {
        invalidPlates.push(newPlate);
      }
    }

    const pageEndTime = Date.now();
    const pageDurationMs = pageEndTime - pageStartTime;
    pagePerformance.push({
      pageNumber,
      durationMs: pageDurationMs,
    });
  } catch (error) {
    logger.log(
      AL_SHAMIL_SELECTORS.SOURCE_NAME,
      LEVEL.ERROR,
      `Error fetching page ${pageNumber}: ${error}`,
    );
    throw error;
  }
};

export const scrapeAlShamilPlates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number = DEFAULT_CONCURRENCY,
): Promise<validAndInvalidPlates> => {
  let currentPage = startPage;
  let consecutiveErrors = 0;
  const startTime = Date.now();
  let shouldContinue = true;

  while (shouldContinue && !finished && currentPage <= endPage) {
    try {
      const pagesToScrape = Array.from(
        { length: concurrentRequests },
        (_, i) => currentPage + i,
      );

      await Promise.all(
        pagesToScrape.map((pageNumber) => fetchAlShamilPage(pageNumber)),
      );

      consecutiveErrors = 0;

      currentPage += concurrentRequests;

      if (currentPage > endPage) {
        shouldContinue = false;
      }
    } catch (error) {
      consecutiveErrors += 1;
      if (consecutiveErrors >= MAX_ERRORS) {
        logger.log(
          AL_SHAMIL_SELECTORS.SOURCE_NAME,
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
    AL_SHAMIL_SELECTORS.SOURCE_NAME,
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
