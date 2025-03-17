import {config} from "dotenv";

config();

class AppConfig {
  host: string = "0.0.0.0";
  port: number = 5000;

  get recommenderUrl(): string {
    return `http://${process.env.REC_HOST || "recommend"}:${process.env.REC_PORT || 3000}`
  }
}

const jsonMiddlewareOptions = {
  strict: true,
};

const urlencodedMiddlewareOptions = {
  extended: true,
};

const appConfig = new AppConfig();

export {appConfig, jsonMiddlewareOptions, urlencodedMiddlewareOptions};
