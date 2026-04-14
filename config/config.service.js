"use strict";

import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve("./config/.env.dev") });

// export const port = process.env.PORT ;
export const env = {
  port: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  MONGOOS_URL:process.env.MONGOOS_URL,
};
