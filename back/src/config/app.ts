import {config} from "dotenv";

config();

class AppConfig {
  host: string = process.env.APP_HOST!;
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
