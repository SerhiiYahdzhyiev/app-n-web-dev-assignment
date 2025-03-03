import express, { Express, json } from "express";
import cors from "cors";

import {
  jsonMiddlewareOptions,
} from "./config/app";

import { logger } from "./logger";
import { handleError } from "./common/middlewares/error.middleware";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(json(jsonMiddlewareOptions));

app.use(handleError(logger));

export default app;
