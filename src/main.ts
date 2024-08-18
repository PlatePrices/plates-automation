import { scrapeDubizzlePlates } from './scrapers/dubizzel.js';
import { scrapeEmiratesAuctionPlates } from './scrapers/emiratesauction.js';
import { scrapeNumbersAePlates } from './scrapers/numberAe.js';
import { scrapePlatesAePlates } from './scrapers/plates.js';
import { scrapeXplatesPlates } from './scrapers/xplate.js';
import { Plate } from './types/plates.js';
import { plateCollection } from './Database/schemas/plates.schema.js';
import { OperationPerformance } from './Database/schemas/performanceTracking.js';
import dotenv from 'dotenv';
import { Database } from './Database/db.js';

dotenv.config();
const database = new Database();
const extractAllPlates = async (): Promise<Plate[]> => {
  const startTime = Date.now();
  await database.connectToDb();
  const plateGroups = await Promise.all([
    scrapeDubizzlePlates(),
    scrapeEmiratesAuctionPlates(),
    scrapeNumbersAePlates(),
    scrapePlatesAePlates(),
    scrapeXplatesPlates(),
  ]);

  const allPlates: Plate[] = [];
  for (const plateGroup of plateGroups) {
    for (const plate of plateGroup ?? []) {
      allPlates.push(plate);
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
    console.error('Error saving performance to database:', error);
  }

  return allPlates;
};

const savePlatesToDb = async (plates: Plate[]) => {
  try {
    await database.addPlates(plates);
    console.log('All plates have been saved');
  } catch (error) {
    console.error('Error saving plates to database:', error);
  }
};

const run = async () => {
  const plates = await extractAllPlates();
  await savePlatesToDb(plates);
};

run();
