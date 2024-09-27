import dotenv from 'dotenv';
import database from './Database/db.js';
import logger from './logger/winston.js';
import { scrapeXplatesPlates } from './scrapers/xplate.js';
import { LEVEL } from './types/logs.js';
import { io } from 'socket.io-client';
import { sources } from './types/plates.js';
dotenv.config();

const socket = io('http://localhost:5454');

type scrapeData = {
  sources: sources[],
  startPage: number,
  endPage: number
};

// Flag to track if scraping is in progress
let isScrapingInProgress = false;

socket.on('startScraping', async (data: scrapeData) => {
  // Check if scraping is already in progress
  if (isScrapingInProgress) {
    console.log('Scraping is already in progress, rejecting new task');
    return;
  }

  console.log('startPage : ', data.startPage, " endPage : ", data.endPage);
  isScrapingInProgress = true;  // Set flag to true before starting
  await getSelectedPlates(data.sources, data.startPage, data.endPage);
});

async function getSelectedPlates(
  sources: sources[],
  startPage: number,
  endPage: number
) {
  try {
    logger.log('main', LEVEL.INFO, 'starting scraping');
    const startTime = Date.now();

    await database.connectToDb();
    const plateGroups = await Promise.all([
      // Add other scrapers as needed
      scrapeXplatesPlates(startPage, endPage)
    ]);

    for (const plateGroup of plateGroups) {
      if (plateGroup.validPlates.length !== 0) {
        await database.addValidPlates(plateGroup.validPlates);
      }
      if (plateGroup.invalidPlates.length !== 0) {
        await database.addInvalidPlates(plateGroup.invalidPlates);
      }
      console.log(`number of valid plates: ${plateGroup.validPlates.length.toString()}`);
      console.log(`number of invalid plates: ${plateGroup.invalidPlates.length.toString()}`);
    }

    const endTime = Date.now();
    const totalDurationMs = endTime - startTime;
    
    await database.saveMainOperationPerformance(new Date(startTime), new Date(endTime), totalDurationMs);
    logger.log('main', LEVEL.INFO, `time in ms: ${totalDurationMs}`);
    logger.log('main', LEVEL.INFO, 'finished scraping');
  } catch (error) {
    logger.log('main', LEVEL.ERROR, `Error during scraping: ${error.message}`);
  } finally {
    // Reset the flag once scraping is finished
    isScrapingInProgress = false;
    socket.emit('scrapingComplete');
  }
}
