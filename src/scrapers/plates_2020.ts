import fetch from 'node-fetch';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { performanceType } from '../types/performance.js';
import { PLATES_2020_SELECTORS } from '../config/2020.config.js';
import { validatePlate } from '../validation/zod.js';
import database from '../Database/db.js'
import { plates_2020 } from '../types/plates_2020.js';
export const scrapePlates_2020 = async (): Promise<validAndInvalidPlates> => {
  let pageNumber = 1;
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();

  let shouldContinue = true;

  while (shouldContinue) {
    const pageStartTime = Date.now();

    const response = await fetch(`${PLATES_2020_SELECTORS.SOURCE_NAME}${pageNumber}`);
    if (!response.ok) {
      throw new Error(`Http error! Status: ${response.status.toString()}`);
    }

    const responseData = await response.json() as plates_2020;
    const carPlates = responseData['data']['items'];

    if (carPlates.length === 0) {
      shouldContinue = false;
      break;
    }

    for (const carPlate of carPlates) {
      const price = carPlate['price'];
      const number = carPlate['number'];
      const character = carPlate['code']['code'];
      const url = PLATES_2020_SELECTORS.SHARABLE_LINK + ['id'];
      const image = 'NA';
      const emirate = carPlate['code']['city']['name'];
      const contact = carPlate['editor']['phone'];

      const newPlate: Plate = {
        url,
        number,
        price,
        character: character,
        image,
        emirate,
        source: PLATES_2020_SELECTORS.SOURCE_NAME,
        contact,
      };

      const plateValidation = validatePlate(newPlate, PLATES_2020_SELECTORS.SOURCE_NAME);
      if (!plateValidation.isValid) {
        invalidPlates.push(plateValidation.data);
      } else validPlates.push(newPlate);
    }
    const pageEndTime = Date.now();
    const pageTotalTimeInMs = pageEndTime - pageStartTime;
    pagePerformance.push({
        pageNumber,
        durationMs: pageTotalTimeInMs
    })
    pageNumber++;
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(PLATES_2020_SELECTORS.SOURCE_NAME, new Date(startTime), new Date(endTime), totalDurationMs)
  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance);

  return {validPlates: validPlates, invalidPlates: invalidPlates};
};
