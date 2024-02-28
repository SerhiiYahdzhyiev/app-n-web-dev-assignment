import { config } from "dotenv";

config();

export const SECRET = process.env.SECRET!;
export const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || "1d";
