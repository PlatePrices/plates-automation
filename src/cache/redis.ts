import { createClient, RedisClientType } from 'redis';
import { REDIS_URL_CONNECTION } from '../config/config.js';
import logger from '../logger/winston.js';
import { LEVEL } from '../types/logs.js';
class Redis {
  public redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      url: REDIS_URL_CONNECTION,
    });
  }

  public async connectToRedis(): Promise<void> {
    this.redisClient.on('error', (error) => {
      logger.log('redis', LEVEL.ERROR, `redis not connected ${error}`);
    });
    await this.redisClient.connect();
    await this.isRedisConnected();
  }
  private async isRedisConnected(): Promise<void> {
    try {
      const response = await this.redisClient.ping();
      logger.log('redis', LEVEL.INFO, `redis connection status ${response}`);
    } catch (error) {
      logger.log('redis', LEVEL.ERROR, 'error while using redis server');
    }
  }
}
export default new Redis();
