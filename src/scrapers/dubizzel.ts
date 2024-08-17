import fetch from 'node-fetch';
import { Plate } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { performanceType } from '../types/performance.js';
import { CONFIG, DUBIZZLE_SELECTORS } from '../config/dubizzle.config.js';
import { savingLogs } from '../utils/saveLogs.js';

export const scrapeDubizzlePlates = async (): Promise<Plate[] | void> => {
  let pageNumber = 0;
  const results: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();

  while (true) {
    const pageStartTime = Date.now();

    try {
      const response = await fetch(DUBIZZLE_SELECTORS.URL, CONFIG(pageNumber));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = (await response.json()) as any;
      const carPlates = responseData['results'][0]['hits'];

      if (carPlates.length === 0) {
        break;
      }

      for (const plate of carPlates) {
        const price = plate['price'];
        const number = plate['details']['Plate number']['ar']['value'];
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
          url: url,
          price: `${price}`,
          number: parseInt(number),
          character: character,
          image: image,
          emirate: emirate,
          source: DUBIZZLE_SELECTORS.SOURCE_NAME,
        };

        const isItValidPlate = validatePlate(newPlate, DUBIZZLE_SELECTORS.SOURCE_NAME);
        if (!isItValidPlate) {
          console.log(
            'Plate with the following attributes is not valid: ',
            newPlate,
            DUBIZZLE_SELECTORS.SOURCE_NAME
          );
          return;
        }
        results.push(newPlate);
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
      console.error(`Error fetching data for page ${pageNumber}:`, error);
      break;
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
  await savingLogs(
    performanceRecord.startTime,
    performanceRecord.totalDurationMs,
    DUBIZZLE_SELECTORS.SOURCE_NAME
  );
  return results;
};
