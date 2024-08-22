import cacheScraper from '../cache/scraper.cache.js';
import logger from '../logger/winston.js';
import { cachePlates, Plate } from '../types/plates.js';

export const checkLatestRecords = async (
  shouldContinue: boolean,
  isCached: boolean,
  source: string,
  validPlates: Plate[],
  page: number,
) => {
  const cacheResult: cachePlates = await cacheScraper.BaseCachePlates(validPlates, page, source);
  if (cacheResult.hasMatch) {
    if (cacheResult.data) {
      shouldContinue = false;
      logger.info('Plates were cached in the previous process. Retrieval is in the process');
    } else {
      logger.info('Plates were being saved for the next time');
    }

    isCached = true;
  } else if (cacheResult.data) {
    logger.info('Plates were saved for the next time to retrieve');
    isCached = true;
  } else {
    logger.warn('Plates were not cached in the process nor found');
  }

  return { isItCached: isCached, shouldItStop: shouldContinue };
};
