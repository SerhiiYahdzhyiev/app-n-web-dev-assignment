import Redis from "ioredis";
import express, { Express, json } from "express";
import cors from "cors";

import { cacheConfig } from "./config/cache";

import {
  jsonMiddlewareOptions,
} from "./config/app";

import { logger } from "./logger";
import { handleError } from "./common/middlewares/error.middleware";

import {getRecommendedProducts} from "./modules/recommend";

const app: Express = express();
const cache = new Redis({
  host: cacheConfig.host,
  port: cacheConfig.port,
});

cache.on("error", (err) => {
  logger.error(String(err), {label: "cache"});
});

app.use(cors({
  origin: "http://localhost:4818",
}));
app.use(json(jsonMiddlewareOptions));

app.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const cacheKey = `rec:${userId}`;
    const cachedData = await cache.get(cacheKey);

    let products;
    if (cachedData) {
      logger.info("Returning cached recommended products...", {label: "recommender"});
      products = JSON.parse(cachedData);
    } else {
      products = await getRecommendedProducts(userId);
      await cache.set(cacheKey, JSON.stringify(products), "EX", cacheConfig.exp)
      logger.info("Returning recommended products...", {label: "recommender"});
    }

    res.status(200);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.use(handleError(logger));

export default app;
