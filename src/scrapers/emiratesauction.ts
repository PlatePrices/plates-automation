import fetch from 'node-fetch';

import { EMIRATES_AUCTION_SELECTORS } from '../config/emiratesauction.config.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { performanceType } from '../types/performance.js';
import { emirates, Plate } from '../types/plates.js';
import getImageFromEmirate from '../utils/imagExtractor.js';
import { savingLogs } from '../utils/saveLogs.js';
import { validatePlate } from '../validation/zod.js';

export const scrapeEmiratesAuctionPlates = async (): Promise<Plate[] | void> => {
  const results: Plate[] = [];
  const pagePerformance: performanceType[] = [];
  let pageNumber = 0;

  const startTime = Date.now();

  for (const [emirateName, emirateId] of Object.entries(emirates)) {
    const pageStartTime = Date.now();

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

      const responseData = (await response.json()) as any;
      const carPlates = responseData['Data'];

      for (const carPlate of carPlates) {
        const url = carPlate['SharingLink'];
        const number = carPlate['PlateNumber'];
        const img = await getImageFromEmirate(number);
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

        const isItValidPlate = validatePlate(newPlate, EMIRATES_AUCTION_SELECTORS.SOURCE_NAME);
        if (!isItValidPlate) {
          console.log(
            'Plate with the following attributes is not valid: ',
            newPlate,
            EMIRATES_AUCTION_SELECTORS.SOURCE_NAME,
          );
          return;
        }
        results.push(newPlate);
      }
    } catch (error) {
      console.error(`Error fetching plate data for ${emirateName}`, error);
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

  return results;
};
