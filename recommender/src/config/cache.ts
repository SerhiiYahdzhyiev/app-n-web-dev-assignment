import { config } from "dotenv"

config();

const TEN_MINUTES = 600;

export const cacheConfig = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT!,
  exp: +process.env.CACHE_EXP! || TEN_MINUTES,
}
