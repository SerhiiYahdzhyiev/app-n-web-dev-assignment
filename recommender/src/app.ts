import express, { Express, json } from "express";
import cors from "cors";

import {
  jsonMiddlewareOptions,
} from "./config/app";

import { logger } from "./logger";
import { handleError } from "./common/middlewares/error.middleware";

import {getRecommendedProducts} from "./modules/recommend";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:4818",
}));
app.use(json(jsonMiddlewareOptions));

app.get("/:userId", async (req, res, next) => {
  try {
    const products = await getRecommendedProducts(req.params.userId);
    res.status(200);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.use(handleError(logger));

export default app;
