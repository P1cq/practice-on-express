import { env } from "./index.js";
// import { MongoClient } from "mongodb";

// const mongodbClient = new MongoClient(env.MONGO_URL);

// export const connectDb = async function () {
//   try {
//     await mongodbClient.connect();
//     console.log("connecting db succefuly");
//   } catch (error) {
//     console.log({ message: "connecting db fail", error });
//   }
// };

// export const db = mongodbClient.db(env.DB_NAME);

import mongoose from "mongoose";

export const connectDb = async function () {
  try {
    await mongoose.connect(env.MONGOOS_URL);
    console.log("connecting db succefuly");
  } catch (error) {
    console.log({ message: "connecting db fail", error });
  }
};
