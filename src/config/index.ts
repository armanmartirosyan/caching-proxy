import type { ValidatedEnv } from "../types";
import { validateEnv } from "./validateEnv";

const env: ValidatedEnv = validateEnv();

export {
  env,
  validateEnv,
};