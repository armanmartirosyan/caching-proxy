import {configService } from "./config";
import { CachingProxyServer } from "./core/caching.proxy";

const server = new CachingProxyServer(configService.env.PORT, configService.env.REDIRECT_URL);

server.startup();
// process.on("uncaughtException", (e) => {
// });

// process.on("unhandledRejection", (e) => {
// });

// process.on("exit", () => {
//   process.exit(1);
// });
