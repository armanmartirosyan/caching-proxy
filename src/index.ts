import "./config";
// import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse, SecureServerOptions } from "node:http2";
// import { readFileSync } from "node:fs";

// import { logger } from "./common/logger";
// import { CachingProxyServer } from "./core/cachingProxy";
// import { configService } from "./config";


// const options: SecureServerOptions = {
//   key: readFileSync("./certificates/localhost-privkey.pem"),
//   cert: readFileSync("./certificates/localhost-cert.pem"),
//   allowHTTP1: true,
// }

// const server = new CachingProxyServer(options, (req: Http2ServerRequest, res: Http2ServerResponse) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   res.end(JSON.stringify({
//     data: 'Hello World!',
//   }));
// });

// server.listen(configService.env.PORT, () => {
//   logger.info(`Server is running on port ${configService.env.PORT}`)
// });
// logger.debug(env);

// process.on("uncaughtException", (e) => {
// });

// process.on("unhandledRejection", (e) => {
// });

// process.on("exit", () => {
//   process.exit(1);
// });
