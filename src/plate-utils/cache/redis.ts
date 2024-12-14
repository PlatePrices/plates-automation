import { createClient, RedisClientType } from 'redis';

class Redis {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      url: '',
    });
  }

  public async connectToRedis() {
    await this.redisClient.connect();
    await this.checkRedisConnection();
  }

  private async checkRedisConnection() {
    try {
      const response = await this.redisClient.ping();
      console.log(response);
    } catch (error) {
      console.log('error while connecting to redis server');
    }
  }
}
export default new Redis();
