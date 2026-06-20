import { createClient } from "redis";
import { env } from "../../config/config.service.js";
export const redisClint = createClient({
  url: env.redisUrl,
});

export const redisConnection = async function () {
  try {
    await redisClint.connect();
    console.log("redis is connected");
  } catch (err) {
    console.log(err);
    console.log("fail to connection");
  }
};
