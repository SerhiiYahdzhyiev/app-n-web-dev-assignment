import {config} from "dotenv";

config();

const port: number = +process.env.DB_PORT!;
const host: string = process.env.DB_HOST!;
const dbName: string = process.env.DB_NAME!;
const user: string = process.env.DB_USER!;
const pass: string = process.env.DB_PASSWORD!;

const mongoUri: string = `mongodb://${host}:${port}`;

const mongooseConnectionOptions = {
  dbName,
  user,
  pass,
};

export {mongoUri, mongooseConnectionOptions};
