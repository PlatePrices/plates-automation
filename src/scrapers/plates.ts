import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";
import { ScraperPerformance } from "../Database/schemas/performance.schema.js";
import { performanceType } from "../types/performance.js";

const carPlates: Plate[] = [];

const fetchPage = async (page: number): Promise<boolean> => {
  const data = `page=${page}`;
  const headers = SELECTORS.PLATES_AE.HEADERS;

  try {
    const pageStartTime = Date.now();

    const response = await fetch(SELECTORS.PLATES_AE.BASE_URL, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(SELECTORS.PLATES_AE.ALL_PLATES));
    if (plates.length === 0) {
      return false;
    }

    plates.forEach((plate) => {
      const plateElement = $(plate);
      const price =
        plateElement.find(SELECTORS.PLATES_AE.PRICE).text().trim() || "";
      const link = plateElement.find("a").attr("href") || "";
      const contact = plateElement.find("a").attr("href")?.slice(4, 15) || "";
      const number =
        plateElement.find(SELECTORS.PLATES_AE.PLATE_NUMBER).text().trim() || "";
      const character =
        plateElement.find(SELECTORS.PLATES_AE.CHARACTER).text().trim() || "";
      const img = plateElement.find("img").attr("src") || "";

      const newPlate: Plate = {
        link,
        price,
        contact,
        number,
        character,
        img,
        source: "plates.ae",
      };
      const isItValidPlate = validatePlate(newPlate);

      if (isItValidPlate) {
        carPlates.push(newPlate);
      } else {
        console.log(
          "Plate with the following attributes is not valid: ",
          newPlate,
          "platesAe"
        );
      }
    });

    const pageEndTime = Date.now();
    const pageDurationMs = pageEndTime - pageStartTime;
    const pageDurationSec = pageDurationMs / 1000;

    console.log(
      `Page ${page} fetched in ${pageDurationMs} ms (${pageDurationSec} s)`
    );

    return true;
  } catch (error) {
    console.error("Error fetching page:", error);
    return false;
  }
};

export const platesAeRunner = async () => {
  const startTime = Date.now();

  let page = 0;
  let hasMorePages = true;

  const pagePerformances:performanceType[] = [];

  while (hasMorePages) {
    const batchStartTime = Date.now();

    hasMorePages = await fetchPage(page);

    const batchEndTime = Date.now();
    const batchDurationMs = batchEndTime - batchStartTime;
    const batchDurationSec = batchDurationMs / 1000;

    pagePerformances.push({
      pageNumber: page,
      durationMs: batchDurationMs,
      durationSec: batchDurationSec,
    });

    page++;
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const totalDurationSec = totalDurationMs / 1000;

  console.log(
    `Scraping completed. Total duration: ${totalDurationMs} ms (${totalDurationSec} s)`
  );

  const performanceRecord = new ScraperPerformance({
    scraperName: "platesAe",
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    totalDurationSec,
    pagePerformances,
  });

  await performanceRecord.save();

  return carPlates;
};
