import type { NextFunction, Express, Request, Response } from "express";
import type { AxiosResponse } from "axios";
import type { Server } from "node:http";
import https from "node:https";
import express from "express";
import axios from "axios";

import { RedisService } from "./redis/redis.service";
import { logger } from "../common/logger";

export class CachingProxyServer {
  private _app: Express;
  private _server: Server | null;
  private _redirectUrl: string;
  private _redis: RedisService;
  private _port: number;

  constructor(port: number, redirectUrl: string) {
    this._app = express();
    this._port = port;
    this._redis = new RedisService();
    this._redirectUrl = redirectUrl;
    this._server = null;
  }

  public startup(): void {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(this._requestLogger.bind(this));
    this._app.use(this._cacheMiddleware.bind(this));
    this._app.use(this._proxyAllOtherMethods.bind(this));


    this._server = this._app.listen(this._port, (): void => {
      logger.info(`Caching server is running on port ${this._port}`);
    });
  }

  private async _cacheMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.method !== "GET")
      return next();

    const cacheKey: string = `${req.method}${req.originalUrl}`;
    const cached: string | null = await this._redis.get(cacheKey);

    if (cached) {
      logger.info("Cache HIT.");
      res.setHeader("X-Cache", "HIT");
      res.send(JSON.parse(cached));
      return;
    }

    try {
      const url: string = this._redirectUrl.replace(/\/+$/, "") + req.originalUrl;
      const response: AxiosResponse = await axios.get(url);
      res.setHeader("X-Cache", "MISS");
      await this._redis.set(cacheKey, JSON.stringify(response.data), 60);
      logger.info("Cache MISS.");
      res.status(200).send(response.data);
      next();
    } catch (error: unknown) {
      logger.error("Error fetching from origin server", error);
      res.status(500).send("Error fetching from origin server");
      return;
    }
  }

  private async _proxyAllOtherMethods(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.debug("[proxy] method:", req.method);
    logger.debug("[proxy] originalUrl:", req.originalUrl);
    logger.debug("[proxy] redirect base:", this._redirectUrl);

    const method: string = req.method.toUpperCase();
    if (method === "GET") {
      next();
      return;
    }

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const url: string = this._redirectUrl.replace(/\/+$/, "") + req.originalUrl;

      logger.debug("[proxy] forwarding request:", {
        method: req.method,
        url,
        body: req.body,
        headers: req.headers,
      });

      const response: AxiosResponse = await axios({
        method: req.method,
        url,
        httpsAgent: agent,
        data: req.body,
        validateStatus: (): true => true,
      });

      logger.debug("[proxy] received response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      res.status(response.status).set(response.headers).send(response.data);
      return;
    } catch (err) {
      logger.error("Error proxying non-GET request", err);
      res.status(500).send("Failed to proxy request");
      return;
    }
  }


  private _requestLogger(req: Request, res: Response, next: NextFunction): void {
    logger.info(req.method.toUpperCase(), `${this._redirectUrl}${req.url}`);
    next();
  }

  public shutdown(): void {
    this._redis.disconnect();
    if (this._server)
      this._server.close();
    logger.info("Caching server shut down.");
  }

}
