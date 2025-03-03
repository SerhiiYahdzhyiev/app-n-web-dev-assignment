import express, { Express, json } from "express";
import cors from "cors";

import {
  jsonMiddlewareOptions,
} from "./config/app";

import { logger } from "./logger";
import { handleError } from "./common/middlewares/error.middleware";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:4818",
}));
app.use(json(jsonMiddlewareOptions));

app.get("/echo", (req, res) => {
  console.log(req.headers);
  console.log(req.body);

  res.status(200);
  res.json({
    success: true,
    payload: req.body
  });
});

app.use(handleError(logger));

export default app;
