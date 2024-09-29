import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import database from "../Database/db.js";
import { DUBAI_XPLATES_SELECTORS } from "../config/dubaixplates.config.js";
import { performanceType } from "../types/performance.js";
import { validatePlate } from "../validation/zod.js";
import logger from "../logger/winston.js";
import { LEVEL } from "../types/logs.js";

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

const DEFAULT_CONCURRENCY = 5; 
const MAX_ERRORS = 5;

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
      return;
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
    throw error; 
  }
};

export const scrapeDubaiXplates = async (
  startPage: number, 
  endPage: number,
  concurrentRequests: number = DEFAULT_CONCURRENCY
): Promise<validAndInvalidPlates> => {
  const startTime = Date.now();
  let pageNumber = startPage;
  let consecutiveErrors = 0;
  let shouldContinue =  true;
  while (shouldContinue && pageNumber <= endPage) {
    try {
      const pagesToScrape = Array.from({ length: concurrentRequests }, (_, i) => pageNumber + i);
      
      await Promise.all(pagesToScrape.map((page) => fetchDubaiXplatesPage(page)));

      
      consecutiveErrors = 0;

      pageNumber += concurrentRequests;

      if(pageNumber > endPage) {
        shouldContinue = false;
      }
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
        shouldContinue = false;
        break; 
      }
    }
  }

  const endTime = Date.now();
  const totalDurationInMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    DUBAI_XPLATES_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationInMs
  );

  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance
  );

  return { validPlates, invalidPlates };
};
