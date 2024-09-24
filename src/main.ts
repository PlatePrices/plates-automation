import dotenv from "dotenv";
import database from "./Database/db.js";
import logger from "./logger/winston.js";
import { scrapeDubizzlePlates } from "./scrapers/dubizzel.js";
import { scrapeEmiratesAuctionPlates } from "./scrapers/emiratesauction.js";
import { scrapeNumbersAePlates } from "./scrapers/numberAe.js";
import { scrapePlatesAePlates } from "./scrapers/plates.js";
import { scrapeXplatesPlates } from "./scrapers/xplate.js";
import { LEVEL } from "./types/logs.js";
import { scrapealshamsionlinePlates } from "./scrapers/alshamsionline.js";
import { scrapeAutoTradersPlates } from "./scrapers/autotraders.js";
import { scrapePlates_2020 } from "./scrapers/plates_2020.js";
import { scrapeDubaiXplates } from "./scrapers/dubaixplates.js";
import redis from "./cache/redis.js";
import { ScraperFunction, sources } from "./types/plates.js";
dotenv.config();

const scraperFunctions: Record<sources, ScraperFunction> = {
  _2020: scrapePlates_2020,
  alshamilonline: scrapealshamsionlinePlates,
  AutoTraders: scrapeAutoTradersPlates,
  dubai_xplates: scrapeDubaiXplates,
  Dubizzle: scrapeDubizzlePlates,
  emiratesauction: scrapeEmiratesAuctionPlates,
  platesae: scrapePlatesAePlates,
  xplate: scrapeXplatesPlates,
};

async function main(
  sourcesArray: sources[],
  startPage: number,
  endPage: number,
): Promise<void> {
  logger.log("main", LEVEL.INFO, "Starting scraping process");
  const startTime = Date.now();

  await database.connectToDb();
  await redis.connectToRedis();

  await Promise.all(
    sourcesArray.map(async (source) => {
      const scrapeFunction = scraperFunctions[source];

      if (!scrapeFunction) {
        logger.log(
          "main",
          LEVEL.ERROR,
          `No scraper found for source: ${source}`
        );
        return;
      }

      try {
        let plateGroup;

        if (source === "emiratesauction") {
          plateGroup = await (scrapeFunction as () => Promise<any>)();
        } else {
          plateGroup = await (
            scrapeFunction as (
              startPage: number,
              endPage: number,
            ) => Promise<any>
          )(startPage, endPage);
        }

        if (plateGroup.validPlates.length !== 0) {
          await database.addValidPlates(plateGroup.validPlates);
        }
        if (plateGroup.invalidPlates.length !== 0) {
          await database.addInvalidPlates(plateGroup.invalidPlates);
        }

        console.log(
          `Number of valid plates for ${source}: ${plateGroup.validPlates.length.toString()}`
        );
        console.log(
          `Number of invalid plates for ${source}: ${plateGroup.invalidPlates.length.toString()}`
        );
      } catch (error) {
        logger.log(
          "main",
          LEVEL.ERROR,
          `Error during scraping for ${source}: ${error}`
        );
      }
    })
  );

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  await database.saveMainOperationPerformance(
    new Date(startTime),
    new Date(endTime),
    totalDurationMs
  );
  logger.log("main", LEVEL.INFO, `Total time in ms: ${totalDurationMs}`);
  logger.log("main", LEVEL.INFO, "Finished scraping process");
}

void main(["_2020", "alshamilonline", "AutoTraders", "Dubizzle", "xplate", "dubai_xplates", "emiratesauction", "platesae"], 0, 5000);
