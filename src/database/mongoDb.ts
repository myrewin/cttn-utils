import mongoose from "mongoose";

import { devLog } from "..";

export const model = mongoose.model;
export const Schema = mongoose.Schema;

export const startMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
    devLog("Mongo DB is connected");
  } catch (err) {
    devLog(err);
  }
};