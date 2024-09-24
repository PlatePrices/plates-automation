import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import { validatePlate } from "../validation/zod.js";
import { performanceType } from "../types/performance.js";
import { AutoTraders_SELECTORS } from "../config/autoTraders.config.js";
import database from "../Database/db.js";

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];
let finished = false;

const fetchPage = async (pageNumber: number): Promise<void> => {
  const headers = AutoTraders_SELECTORS.CONFIG.HEADERS;
  const pageStartTime = Date.now();

  try {
    const response = await fetch(AutoTraders_SELECTORS.URL(pageNumber), {
      method: "GET",
      headers,
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(AutoTraders_SELECTORS.ALL_PLATES));

    // Stop if no more plates are found
    if (plates.length === 0) {
      finished = true;
      return;
    }

    for (const plate of plates) {
      const plateElement = $(plate);
      const link = plateElement.find(AutoTraders_SELECTORS.PLATE_LINK).attr("href") || "";
      const price = plateElement.find(AutoTraders_SELECTORS.PRICE).text().trim() || "";
      const character = link.split("/")[6];
      const emirate = link.split("/")[5];
      const plateNumber = plateElement.find(AutoTraders_SELECTORS.PLATE_NUMBER).text().trim();
      const image = "NA"; // Assuming no image URL provided

      const newPlate: Plate = {
        image,
        price,
        url: link,
        character,
        number: plateNumber,
        emirate,
        source: AutoTraders_SELECTORS.SOURCE_NAME,
      };

      // Validate plate
      const plateValidation = validatePlate(newPlate, AutoTraders_SELECTORS.SOURCE_NAME);
      if (plateValidation.isValid) {
        validPlates.push(newPlate);
      } else {
        invalidPlates.push(plateValidation.data);
        console.log("Invalid plate: ", plateValidation.data);
      }
    }

    const pageEndTime = Date.now();
    const totalPageTime = pageEndTime - pageStartTime;
    pagePerformance.push({
      pageNumber,
      durationMs: totalPageTime,
    });
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
  }
};

export const scrapeAutoTradersPlates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number = (endPage - startPage + 1) / 3 // Default concurrent requests
) => {
  const startTime = Date.now();
  let pageNumber = startPage;
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  while (!finished && pageNumber <= endPage) {
    // Fetch a batch of pages concurrently
    const pagesToScrape = pageNumbers.slice(pageNumber - startPage, pageNumber - startPage + concurrentRequests);

    await Promise.all(pagesToScrape.map((page) => fetchPage(page)));

    console.log('Scraped pages:', pagesToScrape);
    
    // Update pageNumber after each batch
    pageNumber += concurrentRequests;
  }

  const endTime = Date.now();
  const totalTimeInMs = endTime - startTime;

  // Save source performance data
  const sourcePerformance = await database.saveSourceOperationPerformance(
    AutoTraders_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalTimeInMs
  );

  // Save page performance data
  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance
  );

  return { validPlates, invalidPlates };
};
