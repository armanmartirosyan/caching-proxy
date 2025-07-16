import { Redis, type RedisKey, type RedisValue } from "ioredis";

import { configService } from "../../config";
import { logger } from "../../common/logger";

export class RedisService {
  private readonly _client: Redis;

  constructor() {
    this._client = new Redis(configService.env.REDIS_URL, {
      retryStrategy: (times: number): number | null => {
        if (times > 2)
          return null;
        return Math.min(times * 1000, 2000);
      },
    });

    this._client.on("connect", () => logger.info("Redis connected."));
    this._client.on("close", () => logger.info("Redis disconnected."));
    this._client.on("error", (err: any) => logger.error("Redis Client Error:", err));
  }

  public disconnect(): void {
    this._client.disconnect();
    logger.info("Redis disconnected.");
  }

  public async set(key: RedisKey, value: RedisValue, expiryInSeconds?: number): Promise<"OK"> {
    if (expiryInSeconds)
      return this._client.set(key, value, "EX", expiryInSeconds);
    return this._client.set(key, value);
  }

  public async get(key: RedisKey): Promise<string | null> {
    return this._client.get(key);
  }

  public del(key: RedisKey): Promise<number> {
    return this._client.del(key);
  }
}