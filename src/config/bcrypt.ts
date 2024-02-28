import { config } from "dotenv";

config();

export const HASH_SALT: number = parseInt(process.env.PSWD_HASH_SALT!);
