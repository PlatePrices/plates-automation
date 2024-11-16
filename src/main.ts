import dotenv from 'dotenv';
import database from './Database/db.js';
import logger from './logger/winston.js';
import { scrapeXplatesPlates } from './scrapers/xplate.js';
import { LEVEL } from './types/logs.js';
import { io } from 'socket.io-client';
import { Plate } from './types/plates.js';
import { SOCKET_SERVER_URL } from './config/config.js';
import { scrapeDubizzlePlates } from './scrapers/dubizzel.js';
import { scrapeAlShamilPlates } from './scrapers/alshamsionline.js';
import { scrapeDubaiXplates } from './scrapers/dubaixplates.js';
import { scrapeAutoTradersPlates } from './scrapers/autotraders.js';
import { scrapeNumbersAePlates } from './scrapers/numberAe.js';
import { scrapePlatesAePlates } from './scrapers/plates.js';
dotenv.config();

const socket = io(SOCKET_SERVER_URL);
socket.on('connect', () => {
  console.log('Connected to the socket server');
});

type scrapeTask = {
  source: string;
  startPage: number;
  endPage: number;
};

let isScrapingInProgress = false;

socket.on('startScraping', async (task: scrapeTask) => {
  console.log(
    `Received task: ${task.source}, pages ${task.startPage} to ${task.endPage}`,
  );
  try {
    if (isScrapingInProgress) {
      console.log('Scraping already in progress');
      return;
    }

    isScrapingInProgress = true;
    await scrapeBySource(task.source, task.startPage, task.endPage);
  } catch (err) {
    console.error('Error during scraping:', err);
    socket.emit('scrapingError', err);
  } finally {
    isScrapingInProgress = false;
  }
});

async function scrapeBySource(
  source: string,
  startPage: number,
  endPage: number,
) {
  try {
    logger.log('main', LEVEL.INFO, `starting scraping for source: ${source}`);

    let validPlates: Plate[] = [];
    let invalidPlates: Plate[] = [];
    await database.connectToDb();

    switch (source) {
      case 'xplate':
        ({ validPlates, invalidPlates } = await scrapeXplatesPlates(
          startPage,
          endPage,
        ));
        break;
      case 'Dubizzle':
        ({ validPlates, invalidPlates } = await scrapeDubizzlePlates(
          startPage,
          endPage,
        ));
        break;
      case 'alshamilonline':
        ({ validPlates, invalidPlates } = await scrapeAlShamilPlates(
          startPage,
          endPage,
        ));
        break;
      case 'dubai_xplates':
        ({ validPlates, invalidPlates } = await scrapeDubaiXplates(
          startPage,
          endPage,
        ));
        break;
      case 'AutoTraders':
        ({ validPlates, invalidPlates } = await scrapeAutoTradersPlates(
          startPage,
          endPage,
        ));
        break;
      case 'platesae':
        ({ validPlates, invalidPlates } = await scrapePlatesAePlates(
          startPage,
          endPage,
        ));
        break;
      case 'numbersAe':
        ({ validPlates, invalidPlates } = await scrapeNumbersAePlates(
          startPage,
          endPage,
        ));
        break;
      default:
        throw new Error(`Unknown source: ${source}`);
    }

    if (validPlates.length > 0) await database.addValidPlates(validPlates);
    if (invalidPlates.length > 0)
      await database.addInvalidPlates(invalidPlates);

    const totalDurationMs = Date.now() - startPage;
    await database.saveMainOperationPerformance(
      new Date(),
      new Date(),
      totalDurationMs,
    );

    logger.log('main', LEVEL.INFO, `Finished scraping for source: ${source}`);
    socket.emit('scrapingComplete', { validPlates, invalidPlates });
  } catch (error) {
    logger.log('main', LEVEL.ERROR, `Error during scraping: ${error}`);
  } finally {
    isScrapingInProgress = false;
  }
}
