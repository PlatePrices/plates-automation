import fetch from "node-fetch";
import getImageFromEmirate from "../utils/imagExtractor.js";
import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";
import { ScraperPerformance } from "../Database/schemas/performance.schema.js";

const emirates = {
  SHARJAH: 23,
  AJMAN: 27,
  RAS_AL_KHAIMAH: 16,
  FUJAIRAH: 14,
};

export const emiratesAuctionRunner = async (): Promise<Plate[]> => {
  const results: Plate[] = [];
  const pagePerformances: {
    pageNumber: number;
    durationMs: number;
    durationSec: number;
  }[] = [];
  let pageNumber = 0;

  const startTime = Date.now();

  for (const [emirateName, emirateId] of Object.entries(emirates)) {
    const pageStartTime = Date.now();

    const data = JSON.stringify({
      PlateFilterRequest: {
        PlateTypeIds: {
          Filter: [],
          IsSelected: false,
        },
        PlateNumberDigitsCount: {
          Filter: [],
          IsSelected: false,
        },
        Codes: {
          Filter: [],
          IsSelected: false,
        },
        EndDates: {
          Filter: [],
          IsSelected: false,
        },
        Prices: {
          From: "",
          To: "",
        },
        AuctionTypeId: emirateId,
      },
      PageSize: 100,
      PageIndex: 0,
      IsDesc: false,
    });

    const config = {
      method: "POST",
      headers: {
        ...SELECTORS.EMIRATES_AUCTION.HEADERS,
        "Content-Type": "application/json",
      },
      body: data,
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
