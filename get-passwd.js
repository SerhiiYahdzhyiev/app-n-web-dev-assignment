import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const salt = +process.env.PSWD_HASH_SALT;
const pwd = process.env.INIT_ADMIN_PASSWORD;

console.log(bcrypt.hashSync(pwd, salt));
