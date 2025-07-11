import type { Http2Server, Http2ServerRequest, Http2ServerResponse, SecureServerOptions } from "node:http2";
import http2 from "node:http2";

export class CachingProxyServer {
  private _server: Http2Server;

  constructor(options: SecureServerOptions, onRequestHandler?: (req: Http2ServerRequest, res: Http2ServerResponse) => void) {
    if (onRequestHandler)
      this._server = http2.createSecureServer(options, onRequestHandler);
    else
      this._server = http2.createSecureServer(options);
  }

  listen(port: number): void;
  listen(port: number, callback: () => void): void;
  listen(port: number, host: string): void;
  listen(port: number, host: string, callback: () => void): void;
  listen(port: number, host: string, backlog: number): void;
  listen(port: number, host: string, backlog: number, callback: () => void): void;
  listen(port: number, host?: string | (() => void), backlog?: number | (() => void), callback?: () => void): void {
    if (typeof host === "function") {
      callback = host;
      host = undefined;
      backlog = undefined;
    } else if (typeof backlog === "function") {
      callback = backlog;
      backlog = undefined;
    }

    this._server.listen(port, host, backlog, callback);
  }


}