import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";
import { ScraperPerformance } from "../Database/schemas/performance.schema.js";
import { performanceType } from "../types/performance.js";

const carPlates: Plate[] = [];

const fetchPage = async (pageNumber: number): Promise<Plate[]> => {
  const url = `https://www.numbers.ae/plate/index?page=${pageNumber}&per-page=19`;
  const headers = SELECTORS.NUMBERS_AE.HEADERS;

  try {
    const response = await fetch(url, { method: "GET", headers });
    const html = await response.text();
    const $ = cheerio.load(html);

    const plates = Array.from($(SELECTORS.NUMBERS_AE.ALL_PLATES));

    const validPlates = plates
      .map((plate) => {
        const plateElement = $(plate);
        const price =
          plateElement.find(SELECTORS.NUMBERS_AE.PRICE).text().trim() || "";
        const link =
          plateElement.find(SELECTORS.NUMBERS_AE.LINK).attr("href") || "";
        const img = plateElement.find("img").attr("src") || "";
        const altText = plateElement.find("img").attr("alt") || "";

        const altTextPart = altText.split("number ")[1];
        const character = altTextPart.charAt(0);
        const number = altTextPart.split(" ")[1];
        const duration = plateElement.find(".posted").text().trim();
        const emirate = altText.split("Plate")[0].trim();

        const newPlate: Plate = {
          img: SELECTORS.NUMBERS_AE.SHARABLE_LINK + img,
          price: price,
          link: SELECTORS.NUMBERS_AE.SHARABLE_LINK + link,
          character,
          number,
          duration,
          emirate,
          source: SELECTORS.NUMBERS_AE.SOURCE_NAME,
        };

        const isItValidPlate = validatePlate(newPlate);

        if (isItValidPlate) {
          return newPlate;
        } else {
          console.error(
            "Plate with the following attributes is not valid: ",
            newPlate,
            "numberAe"
          );
          return undefined;
        }
      })
      .filter((plate): plate is Plate => plate !== undefined);

    return validPlates;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
};

export const numbersRunner = async () => {
  const startTime = Date.now();

  let pageNumber = 0;
  let stop = false;
  let stoppedPageNumber = 0;
  const pagePerformances: performanceType[] = [];

  /**
   * The idea in here is:
   * there are some pages that has same plates nearly so my idea is just to scan each 10 pages and check if they exist or not
   * and so on so fourth
   */
  while (!stop) {
    const batchPlates: Plate[] = [];

    const batchStartTime = Date.now();

    for (let i = 0; i < 10; i++) {
      const pagePlates = await fetchPage(pageNumber);
      batchPlates.push(...pagePlates);
      pageNumber++;
    }

    const batchEndTime = Date.now();
    const batchDurationMs = batchEndTime - batchStartTime;
    const batchDurationSec = batchDurationMs / 1000;

    pagePerformances.push({
      pageNumber,
      durationMs: batchDurationMs,
      durationSec: batchDurationSec,
    });

    const allExist = batchPlates.every((newPlate) =>
      carPlates.some(
        (plate) =>
          plate.character === newPlate.character &&
          plate.number === newPlate.number
      )
    );

    if (!allExist) {
      carPlates.push(
        ...batchPlates.filter(
          (newPlate) =>
            !carPlates.some(
              (plate) =>
                plate.character === newPlate.character &&
                plate.number === newPlate.number
            )
        )
      );
    } else {
      stop = true;
      stoppedPageNumber = pageNumber;
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const totalDurationSec = totalDurationMs / 1000;


  const performanceRecord = new ScraperPerformance({
    scraperName: "numbers",
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    totalDurationSec,
    pagePerformances,
  });

  await performanceRecord.save();

  return carPlates;
};
