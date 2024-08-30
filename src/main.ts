import dotenv from 'dotenv';

import database from './Database/db.js';
import logger from './logger/winston.js';
import { scrapeDubizzlePlates } from './scrapers/dubizzel.js';
import { scrapeEmiratesAuctionPlates } from './scrapers/emiratesauction.js';
import { scrapeNumbersAePlates } from './scrapers/numberAe.js';
import { scrapePlatesAePlates } from './scrapers/plates.js';
import { scrapeXplatesPlates } from './scrapers/xplate.js';

dotenv.config();

const extractAllPlates = async (): Promise<void> => {
  logger.info('starting scraping');
  const startTime = Date.now();
  await database.connectToDb();
  const plateGroups = await Promise.all([
    scrapeDubizzlePlates(),
    scrapeEmiratesAuctionPlates(),
    scrapeNumbersAePlates(),
    scrapePlatesAePlates(),
    scrapeXplatesPlates(),
  ]);

  for (const plateGroup of plateGroups) {
    if (plateGroup.validPlates.length !== 0) {
      await database.addValidPlates(plateGroup.validPlates);
    }
    if (plateGroup.invalidPlates.length !== 0) {
      await database.addInvalidPlates(plateGroup.invalidPlates);
    }
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  await database.saveMainOperationPerformance(new Date(startTime), new Date(endTime), totalDurationMs);
  logger.info('finished scraping');
};

void extractAllPlates();
