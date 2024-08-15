import { CheerioCrawler } from 'crawlee';
import SELECTORS from '../config/xplates.config.js';
import { Plate } from '../types/plates.js';
import { validatePlate } from '../validation/zod.js';
import { ScraperPerformance } from '../Database/schemas/performance.schema.js';
import { performanceType } from '../types/performance.js';
import { savingLogs } from '../utils/saveLogs.js';

const startUrls = [SELECTORS.URL];

const carPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

const crawler = new CheerioCrawler({
  requestHandler: async ({ $, request, log, enqueueLinks }) => {
    const pageStartTime = Date.now();

    log.info(`Scraping ${request.url}`);

    if ($(SELECTORS.ERROR_MESSAGE_SELECTOR).length) {
      log.info(
        `This is the last page, there are no plates on this page ${request.url}. Stopping scraping.`
      );
      return;
    }

    // Reminder: Exclude the first element since it is not a plate as i inspected earlier
    const plates = Array.from($(SELECTORS.ALL_PLATES)).slice(1);

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const imgSrc = plateElement.find('img').attr('data-src') || '';
      const price =
        plateElement.find(SELECTORS.PLATE_PRICE).text().trim() || '';
      const duration =
        plateElement.find(SELECTORS.PLATE_DURATION).text().trim() || '';
      const url = plateElement.find(SELECTORS.PLATE_LINK).attr('href') || '';

      const emirateMatch = url.match(/\/(\d+)-(.+?)-code-/);
      const characterMatch = url.match(/code-(\d+)-/);
      const numberMatch = url.match(/plate-number-(\d+)/);

      const emirate = emirateMatch ? emirateMatch[2] : '';
      const character = characterMatch ? characterMatch[1] : '';
      const number = numberMatch ? numberMatch[1] : '';
      const plateObj: Plate = {
        image: imgSrc,
        price,
        duration,
        url,
        emirate: emirate,
        character: character,
        number: parseInt(number),
        source: SELECTORS.SOURCE_NAME,
      };

      if (
        Object.values(plateObj).every(
          (value) => value && value !== 'featured' && value !== ''
        )
      ) {
        carPlates.push(plateObj);
      }
    });

    const pageEndTime = Date.now();
    const pageDurationMs = pageEndTime - pageStartTime;
    const pageDurationSec = pageDurationMs / 1000;

    log.info(
      `Page ${request.url} processed in ${pageDurationMs} ms (${pageDurationSec} s)`
    );

    const currentPage = parseInt(
      new URL(request.url).searchParams.get('page') || '1',
      10
    );
    const nextPage = currentPage + 1;
    const nextUrl = `https://xplate.com/en/numbers/license-plates?page=${nextPage}`;
    await enqueueLinks({ urls: [nextUrl] });

    pagePerformance.push({
      pageNumber: currentPage,
      durationMs: pageDurationMs,
      durationSec: pageDurationSec,
    });
  },
  maxRequestsPerCrawl: 2000,
  maxConcurrency: 200,
});

export const xplateRunner = async (): Promise<Plate[] | void> => {
  const startTime = Date.now();

  await crawler.run(startUrls);

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const validPlates: Plate[] = [];
  for (const plate of carPlates) {
    const isItValidPlate = validatePlate(plate);
    if (!isItValidPlate) {
      console.log(
        'Plate with the following attributes is not valid: ',
        plate,
        'DUBIZZLE'
      );
      return;
    }
    validPlates.push(plate);
  }

  const performanceRecord = new ScraperPerformance({
    scraperName: SELECTORS.SOURCE_NAME,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    pagePerformance,
  });

  await savingLogs(
    performanceRecord.startTime,
    performanceRecord.totalDurationMs,
    SELECTORS.SOURCE_NAME
  );
  await performanceRecord.save();

  return validPlates;
};
