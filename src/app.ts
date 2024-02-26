import express, {Express, json, urlencoded} from "express";

import {jsonMiddlewareOptions, urlencodedMiddlewareOptions} from "./config/app";
import { handleError } from "./common/middlewares/error.middleware";

import usersRouter from "./modules/users/users.routes";

import { logger } from "./logger";


const app: Express = express();

app.use(json(jsonMiddlewareOptions));
app.use(urlencoded(urlencodedMiddlewareOptions));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.post("/", (req, res) => {
  res.send("Post!" + JSON.stringify(req.body));
})

app.use("/users", usersRouter);

app.use(handleError(logger));

export default app;
