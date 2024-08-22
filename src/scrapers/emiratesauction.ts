import fetch from 'node-fetch';

import cacheScraper from '../cache/scraper.cache.js';
import { EMIRATES_AUCTION_SELECTORS } from '../config/emiratesauction.config.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import logger from '../logger/winston.js';
import { emiratesauctionResponseData } from '../types/emiratesauction.js';
import { performanceType } from '../types/performance.js';
import { NumberOfMatchesForEachEmirate, Plate, emirates, validAndInvalidPlates } from '../types/plates.js';
import { savingLogs } from '../utils/saveLogs.js';
import { validatePlate } from '../validation/zod.js';

export const scrapeEmiratesAuctionPlates = async (): Promise<validAndInvalidPlates> => {
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];
  let pageNumber = 0;

  const startTime = Date.now();

  for (const [emirateName, emirateId] of Object.entries(emirates)) {
    const pageStartTime = Date.now();
    const validPlatesForEachEmirate: Plate[] = [];
    let isCached = false;
    let shouldStop = false;
    const config = {
      method: 'POST',
      headers: {
        ...EMIRATES_AUCTION_SELECTORS.HEADERS,
        'Content-Type': 'application/json',
      },
      body: EMIRATES_AUCTION_SELECTORS.DATA(emirateId),
    };

    try {
      const response = await fetch(EMIRATES_AUCTION_SELECTORS.URL, config);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status.toString()}`);
      }
      type Emirate = keyof typeof NumberOfMatchesForEachEmirate;
      const emirateKey = emirateName as Emirate;
      const leastNumberOfMatchesPerEmirate: number = NumberOfMatchesForEachEmirate[emirateKey];
      const responseData = (await response.json()) as emiratesauctionResponseData;
      const carPlates = responseData['Data'];
      for (const carPlate of carPlates) {
        const url = carPlate['SharingLink'];
        const number = carPlate['PlateNumber'];
        const img = await EMIRATES_AUCTION_SELECTORS.extractImage(parseInt(number));
        const character = carPlate['PlateCode'];
        const price = carPlate['Currency'] + ' ' + carPlate['CurrentPriceStr'];

        const newPlate: Plate = {
          url,
          number: parseInt(number),
          image: img ? img : '',
          character,
          price,
          emirate: emirateName,
          source: EMIRATES_AUCTION_SELECTORS.SOURCE_NAME,
        };

        const plateValidation = validatePlate(newPlate, EMIRATES_AUCTION_SELECTORS.SOURCE_NAME);
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
          validPlatesForEachEmirate.push(newPlate);
        }

        if (!isCached && validPlatesForEachEmirate.length >= leastNumberOfMatchesPerEmirate) {
          const cacheResult = await cacheScraper.emiratesAuctionCachePlates(
            validPlatesForEachEmirate,
            `${EMIRATES_AUCTION_SELECTORS.SOURCE_NAME}_${emirateName}`,
            emirateName,
          );
          if (cacheResult?.hasMatch) {
            logger.info('Plates already exist. Retrieval is on the way');
            isCached = true;
            shouldStop = true;
          } else {
            if (cacheResult?.data) {
              logger.info('Plates were just saved for the next time to retrieve');
              isCached = true;
            } else {
              logger.warn('Plates were not set to cache or even found');
            }
          }
        }
        if (shouldStop) break;
      }
      logger.info(`${validPlatesForEachEmirate.length.toString()} for each emirate: ${emirateName}`);
    } catch (error) {
      logger.error(`Error fetching plate data for ${emirateName}`, error);
    } finally {
      const pageEndTime = Date.now();
      const pageDurationMs = pageEndTime - pageStartTime;
      const pageDurationSec = pageDurationMs / 1000;

      pagePerformance.push({
        pageNumber: pageNumber++,
        durationMs: pageDurationMs,
        durationSec: pageDurationSec,
      });
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const performanceRecord = new ScraperPerformance({
    scraperName: EMIRATES_AUCTION_SELECTORS.SOURCE_NAME,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    pagePerformance,
  });

  await savingLogs(
    performanceRecord.startTime,
    performanceRecord.totalDurationMs,
    EMIRATES_AUCTION_SELECTORS.SOURCE_NAME,
  );
  await performanceRecord.save();

  return { validPlates, invalidPlates };
};
