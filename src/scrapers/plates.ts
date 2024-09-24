import * as cheerio from "cheerio";
import fetch from "node-fetch";

import { PLATES_AE_SELECTORS } from "../config/plates.config.js";
import logger from "../logger/winston.js";
import { performanceType } from "../types/performance.js";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import { validatePlate } from "../validation/zod.js";
import database from "../Database/db.js";
import { LEVEL } from "../types/logs.js";

const DEFAULT_CONCURRENCY = 5; // Number of pages to fetch concurrently
const MAX_ERRORS = 5; // Stop if consecutive errors reach this limit

export const scrapePlatesAePlates = async (
  concurrencyLimit: number = DEFAULT_CONCURRENCY
): Promise<validAndInvalidPlates> => {
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();
  let currentPage = 1;
  let consecutiveErrors = 0;

  // Function to fetch a single page of data
  const fetchPage = async (pageNumber: number): Promise<boolean> => {
    const data = `page=${pageNumber.toString()}`;
    const headers = PLATES_AE_SELECTORS.HEADERS;

    try {
      const response = await fetch(PLATES_AE_SELECTORS.BASE_URL, {
        method: "POST",
        headers: headers,
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const plates = Array.from($(PLATES_AE_SELECTORS.ALL_PLATES));
      if (plates.length === 0) {
        return false; // No more plates found
      }

      for (const plate of plates) {
        const plateElement = $(plate);
        const price = plateElement.find(PLATES_AE_SELECTORS.PRICE).text().trim() || "";
        const url = plateElement.find("a").attr("href") || "";
        const contact = plateElement.find("a").attr("href")?.slice(4, 15) || "";
        const number = plateElement.find(PLATES_AE_SELECTORS.PLATE_NUMBER).text().trim() || "";
        const character = plateElement.find(PLATES_AE_SELECTORS.CHARACTER).text().trim() || "";
        const img = plateElement.find("img").attr("src") || "";

        const newPlate: Plate = {
          url,
          price,
          contact,
          number: parseInt(number),
          character,
          image: img,
          source: PLATES_AE_SELECTORS.SOURCE_NAME,
        };

        const plateValidation = validatePlate(newPlate, PLATES_AE_SELECTORS.SOURCE_NAME);
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
        }
      }

      return true;
    } catch (error) {
      logger.log(
        PLATES_AE_SELECTORS.SOURCE_NAME,
        LEVEL.ERROR,
        `Error fetching page ${pageNumber}: ${error}`
      );
      return false; // Return false on error
    }
  };

  // Function to run page fetchers in batches with a concurrency limit
  const fetchPagesInBatches = async () => {
    while (true) {
      const batch = Array.from({ length: concurrencyLimit }, (_, i) => currentPage + i);

      console.log(batch)
      // Run all page fetchers concurrently
      const results = await Promise.all(batch.map((page) => fetchPage(page)));

      // Check if any page returned no data
      if (!results.every(Boolean)) {
        break; // Exit loop if any page returns no data
      }

      // Reset consecutive errors after a successful batch
      consecutiveErrors = 0;
      currentPage += concurrencyLimit; // Move to the next batch
    }
  };

  // Start fetching pages in batches with concurrency
  await fetchPagesInBatches();

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    PLATES_AE_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs
  );

  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance);

  return { validPlates, invalidPlates };
};
