import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import database from "../Database/db.js";
import { DUBAI_XPLATES_SELECTORS } from "../config/dubaixplates.config.js";
import { performanceType } from "../types/performance.js";
import { validatePlate } from "../validation/zod.js";

let shouldContinue = true;

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

const fetchDubaiXplatesPage = async (pageNumber: number): Promise<void> => {
  const pageStartTime = Date.now();

  try {
    const response = await fetch(
      DUBAI_XPLATES_SELECTORS.URL,
      DUBAI_XPLATES_SELECTORS.GET_REQUEST_OPTIONS(pageNumber) as any
    );
    const html = await response.text();

    if (html.length === 0) {
      shouldContinue = false;
      return;
    }

    const $ = cheerio.load(html);
    const plates = Array.from($(DUBAI_XPLATES_SELECTORS.ALL_PLATES));

    for (const plate of plates) {
      const plateElement = $(plate);
      const number = plateElement
        .find(DUBAI_XPLATES_SELECTORS.PLATE_NUMBER)
        .text()
        .trim();
      const price = plateElement
        .find(DUBAI_XPLATES_SELECTORS.PLATE_PRICE)
        .text()
        .trim();
      const emirate = plateElement
        .find(DUBAI_XPLATES_SELECTORS.PLATE_SOUCE)
        .attr("src");
      const character = plateElement
        .find(DUBAI_XPLATES_SELECTORS.PLATE_CHARACTER)
        .text()
        .trim();
      const url =
        DUBAI_XPLATES_SELECTORS.SHARABLE_LINK +
        plateElement.find(DUBAI_XPLATES_SELECTORS.PLATE_URL).attr("href");

      const newPlate: Plate = {
        source: DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
        number: number,
        price,
        emirate,
        url,
        character,
        image: "NA",
      };

      const plateValidation = validatePlate(
        newPlate,
        DUBAI_XPLATES_SELECTORS.SOURCE_NAME
      );

      if (!plateValidation.isValid) {
        invalidPlates.push(plateValidation.data);
      } else {
        validPlates.push(newPlate);
      }
    }

    const pageEndTime = Date.now();
    const pageDurationMs = pageEndTime - pageStartTime;

    pagePerformance.push({
      pageNumber,
      durationMs: pageDurationMs,
    });
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
  }
};

export const scrapeDubaiXplates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number =( endPage - startPage + 1 ) / 3// Default number of concurrent requests
): Promise<validAndInvalidPlates> => {
  const startTime = Date.now();
  let pageNumber = startPage;

  // Generate an array of page numbers to scrape
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  while (shouldContinue && pageNumber <= endPage) {
    // Fetch a batch of pages concurrently
    const pagesToScrape = pageNumbers.slice(pageNumber - startPage, pageNumber - startPage + concurrentRequests);

    await Promise.all(pagesToScrape.map((page) => fetchDubaiXplatesPage(page)));

    console.log('Scraped pages:', pagesToScrape);

    // Update pageNumber after each batch
    pageNumber += concurrentRequests;
  }

  const endTime = Date.now();
  const totalDurationInMs = endTime - startTime;

  // Save the total performance of the scrape
  const sourcePerformance = await database.saveSourceOperationPerformance(
    DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationInMs
  );

  // Save the performance of individual pages
  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance
  );

  return { validPlates, invalidPlates };
};
