import express, { Express, json } from "express";
import cors from "cors";

import {
  jsonMiddlewareOptions,
} from "./config/app";

import { logger } from "./logger";
import { handleError } from "./common/middlewares/error.middleware";

import Product from "./models/product";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:4818",
}));
app.use(json(jsonMiddlewareOptions));

app.get("/:userId", async (req, res) => {
  //TODO: Realize
  console.log(req.params.userId);
  const products = await Product.find().limit(3);

  res.status(200);
  res.json(products);
});

app.use(handleError(logger));

export default app;
