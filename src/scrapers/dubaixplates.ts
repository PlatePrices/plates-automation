import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import database from "../Database/db.js";
import { DUBAI_XPLATES_SELECTORS } from "../config/dubaixplates.config.js";
import { performanceType } from "../types/performance.js";
import { validatePlate } from "../validation/zod.js";
import logger from "../logger/winston.js"; // Assuming you want to use logger for error handling
import { LEVEL } from "../types/logs.js";

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

// Concurrency configuration
const DEFAULT_CONCURRENCY = 5; // Number of pages to fetch concurrently
const MAX_ERRORS = 5; // Stop if consecutive errors reach this limit

const fetchDubaiXplatesPage = async (pageNumber: number): Promise<void> => {
  const pageStartTime = Date.now();

  try {
    const response = await fetch(
      DUBAI_XPLATES_SELECTORS.URL,
      DUBAI_XPLATES_SELECTORS.GET_REQUEST_OPTIONS(pageNumber) as any
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    if (html.length === 0) {
      throw new Error("No HTML returned for page " + pageNumber);
    }

    const $ = cheerio.load(html);
    const plates = Array.from($(DUBAI_XPLATES_SELECTORS.ALL_PLATES));

    if (plates.length === 0) {
      return; // Stop if no plates are found
    }

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
        number,
        price,
        emirate,
        url,
        character,
        image: "NA",
      };

      const plateValidation = validatePlate(newPlate, DUBAI_XPLATES_SELECTORS.SOURCE_NAME);

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
    logger.log(
      DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
      LEVEL.ERROR,
      `Error fetching data for page ${pageNumber}: ${error}`
    );
    throw error; // Propagate error for handling in the main function
  }
};

export const scrapeDubaiXplates = async (
  concurrentRequests: number = DEFAULT_CONCURRENCY // Default number of concurrent requests
): Promise<validAndInvalidPlates> => {
  const startTime = Date.now();
  let pageNumber = 1;
  let consecutiveErrors = 0;

  while (true) {
    try {
      // Fetch a batch of pages concurrently
      const pagesToScrape = Array.from({ length: concurrentRequests }, (_, i) => pageNumber + i);
      
      await Promise.all(pagesToScrape.map((page) => fetchDubaiXplatesPage(page)));

      console.log('Scraped pages:', pagesToScrape);
      
      // Reset error counter after successful batch
      consecutiveErrors = 0;

      // Update pageNumber after each batch
      pageNumber += concurrentRequests;
    } catch (error) {
      consecutiveErrors += 1;
      logger.log(
        DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
        LEVEL.ERROR,
        `Error during scraping: ${error}`
      );
      
      if (consecutiveErrors >= MAX_ERRORS) {
        logger.log(
          DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
          LEVEL.ERROR,
          `Stopping due to ${MAX_ERRORS} consecutive errors.`
        );
        break; // Stop scraping if too many errors occur
      }
    }
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
