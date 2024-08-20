import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

import XPLATES_SELECTORS from '../config/xplates.config.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { performanceType } from '../types/performance.js';
import { Plate, validAndInvalidPlates } from '../types/plates.js';
import { savingLogs } from '../utils/saveLogs.js';
import { validatePlate } from '../validation/zod.js';

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];
let shouldContinue = true;

const fetchXplatePage = async (pageNumber: number) => {
  const pageStartTime = Date.now();
  const response = await fetch(
    `https://xplate.com/en/numbers/license-plates?page=${pageNumber.toString()}`,
    XPLATES_SELECTORS.CONFIG,
  );
  const html = await response.text();
  const $ = cheerio.load(html);

  if ($(XPLATES_SELECTORS.ERROR_MESSAGE_SELECTOR).length) {
    shouldContinue = false;
    return;
  }
  const plates = Array.from($(XPLATES_SELECTORS.ALL_PLATES)).slice(1);

  for (const plate of plates) {
    const plateElement = $(plate);
    const imgSrc = plateElement.find('img').attr('data-src') || '';
    const price = plateElement.find(XPLATES_SELECTORS.PLATE_PRICE).text().trim() || '';
    const duration = plateElement.find(XPLATES_SELECTORS.PLATE_DURATION).text().trim() || '';
    const url = plateElement.find(XPLATES_SELECTORS.PLATE_LINK).attr('href') || '';

    const emirateMatch = url.match(/\/(\d+)-(.+?)-code-/);
    const characterMatch = url.match(/-code-(.+?)-plate-number-/);
    const numberMatch = url.match(/plate-number-(\d+)/);

    const emirate = emirateMatch ? emirateMatch[2] : '';
    const character = characterMatch ? characterMatch[1] : '';
    const number = numberMatch ? numberMatch[1] : '';

    const newPlate: Plate = {
      image: imgSrc,
      price,
      duration,
      url,
      emirate: emirate,
      character: character,
      number: parseInt(number),
      source: XPLATES_SELECTORS.SOURCE_NAME,
    };

    const plateValidation = validatePlate(newPlate, XPLATES_SELECTORS.SOURCE_NAME);
    if (!plateValidation.isValid) {
      invalidPlates.push(plateValidation.data);
    } else {
      validPlates.push(newPlate);
    }
  }
  const pageEndTime = Date.now();
  const pageDurationMs = pageEndTime - pageStartTime;
  const pageDurationSec = pageDurationMs / 1000;

  pagePerformance.push({
    pageNumber: pageNumber,
    durationMs: pageDurationMs,
    durationSec: pageDurationSec,
  });
};

export const scrapeXplatesPlates = async (): Promise<validAndInvalidPlates> => {
  const startTime = Date.now();
  let page = 1;

  while (shouldContinue) {
    await fetchXplatePage(page);
    page++;
  }
  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const performanceRecord = new ScraperPerformance({
    scraperName: XPLATES_SELECTORS.SOURCE_NAME,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    pagePerformance,
  });

  await savingLogs(performanceRecord.startTime, performanceRecord.totalDurationMs, XPLATES_SELECTORS.SOURCE_NAME);
  await performanceRecord.save();

  return { invalidPlates, validPlates };
};
