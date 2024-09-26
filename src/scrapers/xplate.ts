import * as cheerio from "cheerio";
import fetch from "node-fetch";
import XPLATES_SELECTORS from "../config/xplates.config.js";
import { performanceType } from "../types/performance.js";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import { validatePlate } from "../validation/zod.js";
import database from "../Database/db.js";

let validPlates: Plate[] = [];
let invalidPlates: Plate[] = [];
let pagePerformance: performanceType[] = [];
let shouldContinue = true;

const fetchXplatePage = async (pageNumber: number) => {
  const pageStartTime = Date.now();
  const response = await fetch(
    `https://xplate.com/en/numbers/license-plates?page=${pageNumber.toString()}`
  );
  const html = await response.text();
  const $ = cheerio.load(html);

  if ($(XPLATES_SELECTORS.ERROR_MESSAGE_SELECTOR).length) {
    shouldContinue = false; // Stop fetching pages when error message is encountered
    return;
  }
  const plates = Array.from($(XPLATES_SELECTORS.ALL_PLATES)).slice(1);

  if (plates.length === 0) {
    shouldContinue = false; // Stop fetching if no plates found
    return;
  }

  for (const plate of plates) {
    const plateElement = $(plate);
    const imgSrc = plateElement.find("img").attr("data-src") || "";
    const price =
      plateElement.find(XPLATES_SELECTORS.PLATE_PRICE).text().trim() || "";
    const duration =
      plateElement.find(XPLATES_SELECTORS.PLATE_DURATION).text().trim() || "";
    const url =
      plateElement.find(XPLATES_SELECTORS.PLATE_LINK).attr("href") || "";

    const emirateMatch = url.match(/\/(\d+)-(.+?)-code-/);
    const characterMatch = url.match(/-code-(.+?)-plate-number-/);
    const numberMatch = url.match(/plate-number-(\d+)/);

    const emirate = emirateMatch ? emirateMatch[2] : "";
    const character = characterMatch ? characterMatch[1] : "";
    const number = numberMatch ? numberMatch[1] : "";

    const newPlate: Plate = {
      image: imgSrc,
      price,
      duration,
      url,
      emirate: emirate,
      character: character,
      number: number,
      source: XPLATES_SELECTORS.SOURCE_NAME,
    };

    if (
      newPlate.price?.trim() ===
      XPLATES_SELECTORS.SKIP_CONFIGURATION.CALL_FOR_PRICE ||
      newPlate.duration?.trim() ===
      XPLATES_SELECTORS.SKIP_CONFIGURATION.FEATURED ||
      newPlate.character?.trim() ===
      XPLATES_SELECTORS.SKIP_CONFIGURATION.CHARACTER_HAS_NOC
    )
      continue;

    const plateValidation = validatePlate(
      newPlate,
      XPLATES_SELECTORS.SOURCE_NAME
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
    pageNumber: pageNumber,
    durationMs: pageDurationMs,
  });
};

export const scrapeXplatesPlates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number = 5
): Promise<validAndInvalidPlates> => {
  console.log('Starting scraping from Xplate...');
  validPlates = [];
  invalidPlates = [];
  const startTime = Date.now();
  let currentPage = startPage;

  console.log(shouldContinue, currentPage <= endPage)
  while (shouldContinue && currentPage <= endPage) {

    console.log('entered')
    const remainingPages = endPage - currentPage + 1;
    const pagesToScrape = Array.from(
      { length: Math.min(concurrentRequests, remainingPages) },
      (_, i) => currentPage + i
    );

    console.log(`Scraping pages: ${pagesToScrape}`);

    await Promise.all(pagesToScrape.map((page) => fetchXplatePage(page)));

    // Move to the next set of pages
    currentPage += concurrentRequests;

    // Stop if there are no more pages left to scrape
    if (currentPage > endPage) {
      shouldContinue = false;
    }
  }

  console.log('finsihed that')
  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const sourcePerformance = await database.saveSourceOperationPerformance(
    XPLATES_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs
  );

  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance
  );

  shouldContinue = true;
  return { invalidPlates, validPlates };
};
