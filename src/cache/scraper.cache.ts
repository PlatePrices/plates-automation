import logger from '../logger/winston.js';
import { cachePlates, NumberOfMatchesForEachEmirate, Plate } from '../types/plates.js';

import { RedisCache } from './redis.js';

export class cacheScraper extends RedisCache {
  static pageNumber: number | undefined = undefined;
  public async BaseCachePlates(validPlates: Plate[], pageNumber: number, source: string): Promise<cachePlates> {
    // this means that it is been cached for the first time while scraping in the same process

    if (cacheScraper.pageNumber && cacheScraper.pageNumber !== pageNumber) return { hasMatch: true, data: undefined };
    const isScraperCached = await super.doesKeyExist(source);
    let matchNum = 0;

    if (!isScraperCached) {
      await super.setCache(source, validPlates);
      cacheScraper.pageNumber = pageNumber;
      // meaning it has been in the process
      return { hasMatch: false, data: validPlates };
    } else {
      const cachedPlates = await super.getCache(source);
      for (const validPlate of validPlates) {
        for (const cachedPlate of cachedPlates) {
          if (
            validPlate.number === cachedPlate.number &&
            validPlate.character === cachedPlate.character &&
            validPlate.emirate === cachedPlate.emirate
          ) {
            matchNum++;
            if (matchNum === 2) {
              // it is cached before the process
              return { hasMatch: true, data: validPlates };
            }
          }
        }
      }
      // it has not been cached or even found a match
      return { hasMatch: false, data: undefined };
    }
  }
  public async emiratesAuctionCachePlates(validPlates: Plate[], source: string, emirate: string) {
    type Emirate = keyof typeof NumberOfMatchesForEachEmirate;
    if (emirate in NumberOfMatchesForEachEmirate) {
      const emirateKey = emirate as Emirate;
      const leastNumberOfMatchesPerEmirate: number = NumberOfMatchesForEachEmirate[emirateKey];

      const isEmiratesAuctionCached = await super.doesKeyExist(source);

      if (!isEmiratesAuctionCached) {
        await super.setCache(source, validPlates);
        return { hasMatch: false, data: validPlates };
      } else {
        const cachedPlates = await super.getCache(source);
        let numberOfMatchesFound = 0;
        for (const validPlate of validPlates) {
          for (const cachedPlate of cachedPlates) {
            if (
              validPlate.number === cachedPlate.number &&
              validPlate.character === cachedPlate.character &&
              validPlate.image === cachedPlate.image
            ) {
              numberOfMatchesFound++;
              if (numberOfMatchesFound === leastNumberOfMatchesPerEmirate) {
                return { hasMatch: true, data: validPlates };
              }
            }
          }
        }
        return { hasMatch: false, data: undefined };
      }
    }

    logger.error('Emirate not found in the map');
  }
}

export default new cacheScraper();
