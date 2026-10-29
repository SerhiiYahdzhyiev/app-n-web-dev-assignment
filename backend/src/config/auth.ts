import { config } from "dotenv";
import type { SignOptions } from "jsonwebtoken";

config();

export const SECRET = process.env.SECRET!;
export const TOKEN_EXPIRES = (process.env.TOKEN_EXPIRES || "1d") as SignOptions["expiresIn"];
