import {config} from "dotenv";

config();

class AppConfig {
  host: string = process.env.APP_HOST!;
  port: number = +process.env.APP_PORT!;

  recHost: string = process.env.REC_HOST!;
  recPort: number = +process.env.REC_PORT!;

  get recommenderUrl() {
    return `http://${this.recHost}:${this.recPort}`
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
