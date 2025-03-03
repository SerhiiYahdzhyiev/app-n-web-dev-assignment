import {appConfig} from "./config/app";

import app from "./app";
import { logger } from "./logger";
import { connectDb } from "./db";


async function start(): Promise<void> {
  try {
    await connectDb();
    logger.info("DB Connected!", {label: "db"});
    app.listen(
      appConfig.port,
      appConfig.host,
      () => logger.info("Server is listening!", {label: "server"})
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
