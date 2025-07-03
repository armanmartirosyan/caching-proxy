import logger from "./logger";
import type { ValidatedEnv } from "../types";

function validateEnv(): ValidatedEnv {
  const requiredEnv = {
    number: ["PORT"],
    string: ["LOG_LEVEL", "NODE_ENV", "REDIS_URL"],
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
  if (missingVars.length > 0)
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}. Please check your .env file or environment setup.`);

  logger.info(".env file loaded successfully");

  return env;
}

export const env: ValidatedEnv =  validateEnv();