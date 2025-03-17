import { config } from "dotenv"

config();

const TEN_MINUTES = 600;

export const cacheConfig = {
  host: process.env.REDIS_HOST || "cache",
  port: +process.env.REDIS_PORT! || 6378,
  exp: +process.env.CACHE_EXP! || TEN_MINUTES,
}
