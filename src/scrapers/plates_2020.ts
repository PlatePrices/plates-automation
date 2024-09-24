import fetch from "node-fetch";
import { Plate, validAndInvalidPlates } from "../types/plates.js";
import { performanceType } from "../types/performance.js";
import { PLATES_2020_SELECTORS } from "../config/2020.config.js";
import { validatePlate } from "../validation/zod.js";
import database from "../Database/db.js";
import { plates_2020 } from "../types/plates_2020.js";

export const scrapePlates_2020 = async (
  startPage: number,
  endPage: number,
  concurrencyLimit: number = 5
): Promise<validAndInvalidPlates> => {
  const validPlates: Plate[] = [];
  const invalidPlates: Plate[] = [];
  const pagePerformance: performanceType[] = [];

  const startTime = Date.now();

  let pagesToScrape = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  // Function to fetch a single page of data
  const fetchPage = async (pageNumber: number): Promise<boolean> => {
    try {
      const pageStartTime = Date.now();

      const response = await fetch(
        PLATES_2020_SELECTORS.GET_URL(pageNumber),
        PLATES_2020_SELECTORS.GET_REQUEST_OPTIONS() as any
      );

      const responseData = (await response.json()) as plates_2020;
      const carPlates = responseData["data"]["items"];

      if (carPlates.length === 0) {
        return false;
      }

      for (const carPlate of carPlates) {
        const price = carPlate["price"];
        const number = carPlate["number"];
        const character = carPlate["code"]["code"];
        const url = PLATES_2020_SELECTORS.SHARABLE_LINK + ["id"];
        const image = "NA";
        const emirate = carPlate["code"]["city"]["name"];
        const contact = carPlate["editor"]["phone"];

        const newPlate: Plate = {
          url,
          number: parseInt(number),
          price: price.toString(),
          character: character,
          image,
          emirate,
          source: PLATES_2020_SELECTORS.SOURCE_NAME,
          contact,
        };

        const plateValidation = validatePlate(newPlate, PLATES_2020_SELECTORS.SOURCE_NAME);
        if (!plateValidation.isValid) {
          invalidPlates.push(plateValidation.data);
        } else {
          validPlates.push(newPlate);
        }
      }

      const pageEndTime = Date.now();
      const pageTotalTimeInMs = pageEndTime - pageStartTime;
      pagePerformance.push({
        pageNumber,
        durationMs: pageTotalTimeInMs,
      });

      return true;
    } catch (error) {
      console.error(`Error fetching page ${pageNumber}: ${error}`);
      return false;
    }
  };

  // Function to run page fetchers in batches with a concurrency limit
  const fetchPagesInBatches = async () => {
    while (pagesToScrape.length > 0) {
      // Fetch the next batch of pages up to the concurrency limit
      const batch = pagesToScrape.splice(0, concurrencyLimit);
      const batchStartTime = Date.now();

      // Run all page fetchers concurrently
      const results = await Promise.all(batch.map((page) => fetchPage(page)));

      const batchEndTime = Date.now();
      const batchDurationMs = batchEndTime - batchStartTime;

      // Stop further scraping if a page returns no data
      if (!results.every(Boolean)) {
        pagesToScrape = []; // Clear remaining pages if any batch returns false
      }
    }
  };

  // Start fetching pages in batches with concurrency
  await fetchPagesInBatches();

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  const sourcePerformance = await database.saveSourceOperationPerformance(
    PLATES_2020_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs
  );
  await database.savePagePerformance(sourcePerformance.operation_id, pagePerformance);

  return { validPlates, invalidPlates };
};
