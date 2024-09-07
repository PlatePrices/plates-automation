import dotenv from 'dotenv';

import database from './Database/db.js';
import logger from './logger/winston.js';
import { scrapeDubizzlePlates } from './scrapers/dubizzel.js';
import { scrapeEmiratesAuctionPlates } from './scrapers/emiratesauction.js';
import { scrapeNumbersAePlates } from './scrapers/numberAe.js';
import { scrapePlatesAePlates } from './scrapers/plates.js';
import { scrapeXplatesPlates } from './scrapers/xplate.js';
import { LEVEL } from './types/logs.js';
import { scrapealshamsionlinePlates } from './scrapers/alshamsionline.js';
import { scrapeAutoTradersPlates } from './scrapers/autotraders.js';
import { scrapePlates_2020 } from './scrapers/plates_2020.js';
import { scrapeDubaiXplates } from './scrapers/dubaixplates.js';

dotenv.config();

const extractAllPlates = async (): Promise<void> => {
  logger.log('main', LEVEL.INFO, 'starting scraping');
  const startTime = Date.now();
  await database.connectToDb();
  const plateGroups = await Promise.all([
    scrapeDubizzlePlates(),
    scrapeEmiratesAuctionPlates(),
    scrapeNumbersAePlates(),
    scrapePlatesAePlates(),
    scrapeXplatesPlates(),
    // scrapealshamsionlinePlates(),
    // scrapeAutoTradersPlates(),
    // scrapePlates_2020(),
    // scrapeDubaiXplates()
  ]);

  for (const plateGroup of plateGroups) {
    if (plateGroup.validPlates.length !== 0) {
      await database.addValidPlates(plateGroup.validPlates);
    }
    if (plateGroup.invalidPlates.length !== 0) {
      await database.addInvalidPlates(plateGroup.invalidPlates);
    }
    console.log(`number of valid plates : ${plateGroup.validPlates.length.toString()}`);
    console.log(`number of invalid plates : ${plateGroup.invalidPlates.length.toString()}`);
  }

  const endTime = Date.now();
  const totalDurationMs = endTime - startTime;

  await database.saveMainOperationPerformance(new Date(startTime), new Date(endTime), totalDurationMs);
  logger.log('main', LEVEL.INFO, 'finished scraping');
};

void extractAllPlates();
