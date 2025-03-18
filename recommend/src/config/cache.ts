import { config } from "dotenv"

config();

const TEN_MINUTES = 600;

export const cacheConfig = {
  host: "cache",
  port: 6378,
  exp: +process.env.CACHE_EXP! || TEN_MINUTES,
}
