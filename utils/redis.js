import redis from 'redis';
import { promisify } from 'util';

/* Helper class for all redis opearations */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis connection error: ${error.message}`);
    });

    this.client.on('connect', () => {
      console.log("Redis connection successful")
    });
  }

  /* returns true when the connection to Redis is a success otherwise, false */
  isAlive() {
    return this.client.connected;
  }

  /** takes a string key as argument and returns the Redis value stored
   * for this key
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   takes a string key, a value and a duration in second as arguments
   to store it in Redis (with an expiration set by the duration argument)
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * takes a string key as argument and remove the value in Redis for this key
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
