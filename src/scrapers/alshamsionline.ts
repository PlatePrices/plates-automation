import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import { isvalidNumber, validatePlate } from "../validation/zod.js";
import database from "../Database/db.js";
import { performanceType } from "../types/performance.js";
import { AL_SHAMIL_SELECTORS } from "../config/alshamilonline.config.js";

const validPlates: Plate[] = [];
const invalidPlates: Plate[] = [];
const pagePerformance: performanceType[] = [];

let finished = false;

const fetchPage = async (pageNumber: number): Promise<void> => {
  const pageStartTime = Date.now();
  const headers = AL_SHAMIL_SELECTORS.HEADERS;

  try {
    const response = await fetch(AL_SHAMIL_SELECTORS.URL(pageNumber), {
      method: "GET",
      headers,
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const plates = Array.from($(AL_SHAMIL_SELECTORS.ALL_PLATES).children());

    // Stop if no more than 99 plates are found (implies end of data)
    if (plates.length < 99) {
      finished = true;
    }

    for (const plate of plates) {
      const plateElement = $(plate);
      const linkElement = plateElement.find(AL_SHAMIL_SELECTORS.PLATE_LINK);
      const isSold = linkElement.find("button").text().trim() || "";
      if (isSold === "Sold" || isSold === "Booked") continue;

      const link = linkElement.attr("href") || "";
      const info = link.split("-");
      if (info[1].split("/")[1] === "bike") continue;

      let price =
        plateElement.find(AL_SHAMIL_SELECTORS.PRICE).text().trim() || "";
      if (!price || price === "AED 0") continue;

      price = price !== "Call for price" ? price.split(" ")[1].replace(/[^0-9]/g, "") : price;
      
      let character = info[info.length - 2];
      const number = info[info.length - 1].split("_")[0];
      const duration = plateElement.find($(AL_SHAMIL_SELECTORS.DATE)).text().trim() || "";

      let emirate = "NA";
      if (character.length < 3) {
        if (info.length === 5) emirate = info[2];
        else if (info.length === 6) emirate = info[2] + " " + info[3];
        else if (info.length === 7) emirate = info[2] + " " + info[3] + " " + info[4];
      } else {
        if (info.length === 4) {
          emirate = info[2];
          character = "?";
        } else if (info.length === 5) {
          emirate = info[2] + " " + info[3];
          character = "??";
        } else if (info.length === 6) {
          emirate = info[2] + " " + info[3] + " " + info[4];
          character = "?";
        }
      }

      const image = plateElement.find(AL_SHAMIL_SELECTORS.IMAGE).attr("data-src") || "NA";

      const newPlate: Plate = {
        image,
        price,
        url: link,
        character,
        number,
        emirate,
        source: AL_SHAMIL_SELECTORS.SOURCE_NAME,
        duration,
      };

      const plateValidation = validatePlate(newPlate, AL_SHAMIL_SELECTORS.SOURCE_NAME);

      if (plateValidation.isValid && isvalidNumber(number)) {
        validPlates.push(plateValidation.data);
      } else {
        invalidPlates.push(newPlate);
      }
    }
  } catch (error) {
    finished = true
    console.error(`Error fetching page ${pageNumber}:`, error);
  }

  const pageEndTime = Date.now();
  const pageDuration = pageEndTime - pageStartTime;
  pagePerformance.push({
    pageNumber,
    durationMs: pageDuration,
  });
};

export const scrapealshamsionlinePlates = async (
  startPage: number,
  endPage: number,
  concurrentRequests: number = (endPage - startPage + 1) / 3
) => {
  const startTime = Date.now();
  let pageNumber = startPage;
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  while (!finished && pageNumber <= endPage) {
    // Take the next batch of pages to scrape concurrently
    const pagesToScrape = pageNumbers.slice(pageNumber - startPage, pageNumber - startPage + concurrentRequests);

    // Fetch the pages concurrently
    await Promise.all(pagesToScrape.map((page) => fetchPage(page)));

    console.log('Scraped pages:', pagesToScrape);
    
    // Update pageNumber after the batch is complete
    pageNumber += concurrentRequests;
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const sourcePerformance = await database.saveSourceOperationPerformance(
    AL_SHAMIL_SELECTORS.SOURCE_NAME,
    new Date(startTime),
    new Date(endTime),
    totalDurationMs
  );

  await database.savePagePerformance(
    sourcePerformance.operation_id,
    pagePerformance
  );

  return { validPlates, invalidPlates };
};
