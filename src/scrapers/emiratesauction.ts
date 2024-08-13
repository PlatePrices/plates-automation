import fetch from "node-fetch";
import getImageFromEmirate from "../utils/imagExtractor.js";
import { emirates, Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";
import { ScraperPerformance } from "../Database/schemas/performance.schema.js";
import { performanceType } from "../types/performance.js";

export const emiratesAuctionRunner = async (): Promise<Plate[]> => {
  const results: Plate[] = [];
  const pagePerformances: performanceType[] = [];
  let pageNumber = 0;

  const startTime = Date.now();

  for (const [emirateName, emirateId] of Object.entries(emirates)) {
    const pageStartTime = Date.now();

    const config = {
      method: "POST",
      headers: {
        ...SELECTORS.EMIRATES_AUCTION.HEADERS,
        "Content-Type": "application/json",
      },
      body: SELECTORS.EMIRATES_AUCTION.DATA(emirateId),
    };

    try {
      const response = await fetch(
        "https://apiv8.emiratesauction.net/api/PlatesBuyNow",
        config
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = (await response.json()) as any;
      const carPlates = responseData["Data"];

      for (const carPlate of carPlates) {
        const link = carPlate["SharingLink"];
        const number = carPlate["PlateNumber"];
        const img = await getImageFromEmirate(number);
        const character = carPlate["PlateCode"];
        const price = carPlate["Currency"] + " " + carPlate["CurrentPriceStr"];

        const newPlate: Plate = {
          link,
          number: `${number}`,
          img: img ? img : "",
          character,
          price,
          emirate: emirateName,
          source: "Emirates auction",
        };

        const isItValidPlate = await validatePlate(newPlate);

        if (isItValidPlate) {
          results.push(newPlate);
        } else {
          console.log(
            "Plate with the following attributes is not valid: ",
            newPlate,
            "emiratesauction"
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching plate data for ${emirateName}: ${error}`);
    } finally {
      const pageEndTime = Date.now();
      const pageDurationMs = pageEndTime - pageStartTime;
      const pageDurationSec = pageDurationMs / 1000;

      pagePerformances.push({
        pageNumber: pageNumber++,
        durationMs: pageDurationMs,
        durationSec: pageDurationSec,
      });
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;
  const totalDurationSec = totalDurationMs / 1000;

  const performanceRecord = new ScraperPerformance({
    scraperName: "emiratesAuction",
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    totalDurationSec,
    pagePerformances,
  });

  await performanceRecord.save();

  return results;
};
