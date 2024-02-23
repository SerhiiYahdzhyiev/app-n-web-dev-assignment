import express, {Express, json, urlencoded} from "express";

import {jsonMiddlewareOptions, urlencodedMiddlewareOptions} from "./config/app";

const app: Express = express();

app.use(json(jsonMiddlewareOptions));
app.use(urlencoded(urlencodedMiddlewareOptions));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.post("/", (req, res) => {
  res.send("Post!" + JSON.stringify(req.body));
})

export default app;
