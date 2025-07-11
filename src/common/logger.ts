import type { MethodMapType, ColorType } from "./types";

class Logger {

  private levels: string[];
  private level: string;
  private threshold: number;
  private methodMap: MethodMapType;
  private colors: ColorType;

  constructor() {
    this.levels = ["debug", "info", "warn", "error"];
    this.level = process.env.LOG_LEVEL || "debug";
    this.threshold = this.levels.indexOf(this.level);
    this.methodMap = {
      info: console.log,
      warn: console.warn,
      debug: console.debug,
      error: console.error,
    };
    this.colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[32m",  // Green
      warn: "\x1b[33m",  // Yellow
      error: "\x1b[31m", // Red
      reset: "\x1b[0m",  // Reset to default
    };
  }

  private _log(type: string, ...args: any[]): void {
    if (this.levels.indexOf(type) < this.threshold)
      return;
    const color: string = this.colors[type as keyof ColorType];
    const reset: string = this.colors.reset;
    const prefix: string = `${color}[${type.toUpperCase()}]${reset}`;

    this.methodMap[type as keyof MethodMapType](prefix, ...args);
  }

  public debug(...args: any[]): void {
    this._log("debug", ...args);
  }

  public info(...args: any[]): void {
    this._log("info", ...args);
  }

  public warn(...args: any[]): void {
    this._log("warn", ...args);
  }

  public error(...args: any[]): void {
    this._log("error", ...args);
  }
}

const logger = new Logger();
export { logger };
