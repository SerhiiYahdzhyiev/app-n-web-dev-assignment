import {config} from "dotenv";

config();

class AppConfig {
  host: string = process.env.APP_HOST || "0.0.0.0";
  port: number = +process.env.APP_PORT! || 3000;
}

const jsonMiddlewareOptions = {
  strict: true,
};

const urlencodedMiddlewareOptions = {
  extended: true,
};

const appConfig = new AppConfig();

export {appConfig, jsonMiddlewareOptions, urlencodedMiddlewareOptions};
