import { cachePlates, Plate } from '../types/plates.js';

import { RedisCache } from './redis.js';

export class cacheScraper extends RedisCache {
  static pageNumber: number | undefined = undefined;
  public async cachePlates(validPlates: Plate[], pageNumber: number, source: string): Promise<cachePlates> {
    // this means that it is been cached for the first time while scraping in the same process
    if (cacheScraper.pageNumber) return { hasMatch: true, data: undefined };
    const isDubizzleCached = await super.doesExist(source);
    let matchNum = 0;
    if (!isDubizzleCached) {
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
            if (matchNum === 5) {
              // it is cached before the process
              return { hasMatch: true, data: validPlates };
            }
          }
        }
      }
      // it has not been cached
      return { hasMatch: false, data: undefined };
    }
  }
}

export default new cacheScraper();
