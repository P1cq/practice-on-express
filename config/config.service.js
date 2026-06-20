"use strict";

import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve("./config/.env.dev") });

// export const port = process.env.PORT ;
export const env = {
  port: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  MONGOOS_URL: process.env.MONGOOS_URL,
  clientID: process.env.CLINT_ID,
  clientSecret: process.env.CLINT_SECRET,
  redisUrl: process.env.REDIS_URL,
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  key: process.env.KEY,
  urlBack: process.env.URL_BACK,
  urlFront: process.env.URL_FRONT,
};
