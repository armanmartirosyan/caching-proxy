import { configService } from "./config";
import { CachingProxyServer } from "./core/caching.proxy";
import { logger } from "./common/logger";

const server = new CachingProxyServer(configService.env.PORT, configService.env.REDIRECT_URL);

server.startup();

process.on("uncaughtException", (e: Error) => {
  logger.error(e);
  process.exit(1);
});

process.on("unhandledRejection", (e: unknown) => {
  logger.error(e);
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal recieved.");
  process.exit(130);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal recieved.");
  process.exit(130);
});

process.on("exit", (code: number) => {
  server.shutdown();
  logger.info(`Process exiting with code ${code}`);
});
