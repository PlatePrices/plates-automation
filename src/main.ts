import dotenv from 'dotenv';

import database from './Database/db.js';
import { OperationPerformance } from './Database/schemas/performanceTracking.js';
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
  const totalDurationSec = totalDurationMs / 1000;

  const performanceRecord = new OperationPerformance({
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalDurationMs,
    totalDurationSec,
  });

  try {
    await performanceRecord.save();
  } catch (error) {
    logger.error(`Error saving the performance in the database`, error);
  }
  logger.info('finished scraping');
};

void extractAllPlates();

