import mongoose from "mongoose";

import { mongoUri, mongooseConnectionOptions } from "./config/db";


export async function connectDb() {
  try {
    return mongoose.connect(mongoUri, mongooseConnectionOptions);
  } catch (error) {
    throw error;
  }
}
