import { createClient, RedisClientType } from 'redis';

import logger from '../logger/winston.js';
import { Plate } from '../types/plates.js';

export class RedisCache {
  protected redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient();
    void this.connectToRedis();
  }

  private async connectToRedis(): Promise<void> {
    this.redisClient.on('error', (error) => {
      logger.error('There is a redis client error', error);
    });
    await this.redisClient.connect();
  }

  protected async isClientConnected(): Promise<boolean> {
    try {
      await this.redisClient.ping();
      return true;
    } catch (error) {
      logger.error('Redis client is not connected', error);
      return false;
    }
  }

  public async doesKeyExist(source: string): Promise<boolean> {
    if (!(await this.isClientConnected())) {
      await this.connectToRedis();
    }
    const cached = await this.redisClient.exists(source);
    return cached ? true : false;
  }

  public async getCache(source: string): Promise<Plate[]> {
    if (!(await this.isClientConnected())) {
      await this.connectToRedis();
    }
    const cachedData = await this.redisClient.get(source);
    const cachedPlates: Plate[] = cachedData ? (JSON.parse(cachedData) as Plate[]) : [];
    return cachedPlates;
  }

  public async setCache(source: string, validPlates: Plate[]): Promise<void> {
    if (!(await this.isClientConnected())) {
      await this.connectToRedis();
    }
    await this.redisClient.set(source, JSON.stringify(validPlates), {
      EX: 60 * 60 * 24,
    });
  }
}

export default new RedisCache();
