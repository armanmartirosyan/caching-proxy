import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: `${path.resolve(__dirname, "../../.env")}`,
  quiet: true,
});
import { logger } from "../common/logger";
import type { ValidatedEnv } from "../common/types";

class ConfigService {
  private readonly _env: ValidatedEnv;

  private constructor() {
    this._env = this.validateEnv();
  }

  private validateEnv(): ValidatedEnv {
    const requiredEnv = {
      number: ["PORT"],
      string: ["LOG_LEVEL", "NODE_ENV", "REDIS_URL", "REDIRECT_URL"],
    };
    const env: ValidatedEnv = {} as ValidatedEnv;
    const missingVars: string[] = [];

    for (const val of requiredEnv.number) {
      if (!process.env[val])
        missingVars.push(val);
      else {
        (env as any)[val] = parseInt(process.env[val]);
      }
    }
    for (const val of requiredEnv.string) {
      if (!process.env[val])
        missingVars.push(val);
      else {
        (env as any)[val] = process.env[val];
      }
    }
    if (missingVars.length > 0) {
      logger.error(`Missing required environment variables: ${missingVars.join(", ")}. Please check your .env file or environment setup.`);
      process.exit(1);
    }
    logger.info(".env file loaded successfully");

    return env;
  }

  get env(): ValidatedEnv {
    return this._env;
  }

  static create(): ConfigService {
    return new ConfigService();
  }

}

const configService = ConfigService.create();
export { configService };