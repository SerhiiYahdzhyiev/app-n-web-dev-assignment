import {config} from "dotenv";

config();

class AppConfig {
  host: string = "0.0.0.0";
  port: number = +process.env.APP_PORT!;
}

const jsonMiddlewareOptions = {
  strict: true,
};

const urlencodedMiddlewareOptions = {
  extended: true,
};

const appConfig = new AppConfig();

export {appConfig, jsonMiddlewareOptions, urlencodedMiddlewareOptions};
