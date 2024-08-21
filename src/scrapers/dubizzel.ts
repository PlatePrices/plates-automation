import fetch from 'node-fetch';

import { CONFIG, DUBIZZLE_SELECTORS } from '../config/dubizzle.config.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { DubizzleResponseData } from '../types/dubizzle.js';
import { performanceType } from '../types/performance.js';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { savingLogs } from '../utils/saveLogs.js';
import { validatePlate } from '../validation/zod.js';

export const scrapeDubizzlePlates = async (): Promise<validAndInvalidPlates> => {
  let pageNumber = 0;
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();

  let shouldContinue = true;

  while (shouldContinue) {
    const pageStartTime = Date.now();

    try {
      const response = await fetch(DUBIZZLE_SELECTORS.URL, CONFIG(pageNumber));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status.toString()}`);
      }

      const responseData = (await response.json()) as DubizzleResponseData;
      const carPlates = responseData['results'][0]['hits'];

      if (carPlates.length === 0) {
        shouldContinue = false;
        break;
      }

      for (const plate of carPlates) {
        const price = plate['price'];
        const number = Number(plate['details']['Plate number']['ar']['value']);
        const url = plate['absolute_url']['ar'];
        const image = plate['photos']['main'];
        const emirate = plate['site']['en'];
        let character = plate['details']['Plate code'] ? plate['details']['Plate code']['ar']['value'] : '';

        if (character.length > 3) {
          character = '';
        }

        const newPlate: Plate = {
          url: url,
          price: String(price),
          number: number,
          character: character,
          image: image,
          emirate: emirate,
          source: DUBIZZLE_SELECTORS.SOURCE_NAME,
        };

        const plateValidation = validatePlate(newPlate, DUBIZZLE_SELECTORS.SOURCE_NAME);
        if (!plateValidation.isValid) {
          if (character === 'Red') character = '';
          invalidPlates.push(plateValidation.data);
          console.log(plateValidation.data);
        } else {
          validPlates.push(plateValidation.data);
        }
      }

      const pageEndTime = Date.now();
      const pageDurationMs = pageEndTime - pageStartTime;
      const pageDurationSec = pageDurationMs / 1000;

      pagePerformance.push({
        pageNumber,
        durationMs: pageDurationMs,
        durationSec: pageDurationSec,
      });

      pageNumber++;
    } catch (error) {
      console.error(`Error fetching data for page ${pageNumber.toString()}:`, error);
      shouldContinue = false;
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const performanceRecord = new ScraperPerformance({
    scraperName: DUBIZZLE_SELECTORS.SOURCE_NAME,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    pagePerformance,
  });

  await performanceRecord.save();
  await savingLogs(performanceRecord.startTime, performanceRecord.totalDurationMs, DUBIZZLE_SELECTORS.SOURCE_NAME);
  return { validPlates: validPlates, invalidPlates: invalidPlates };
};
