import { DataTypes, Op } from "sequelize";

import { createClient } from "redis";

import { startKafka, publishEvent, producer, subscriber } from "./kafka";

import { Schema, startMongo, model } from "./database/mongoDb";
import {
  DELETE_QUERY_TYPE,
  INSERT_QUERY_TYPE,
  SELECT_QUERY_TYPE,
  UPDATE_QUERY_TYPE,
  mysqlDb,
  uuid,
} from "./database/sqlDb";


const Redis =  createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
  });

Redis.on("connect", () => console.log("Redis is connected")).on(
  "error",
  (err) => console.log(err)
);

export const setRedis = async (key: any, data: any) => {
  if (typeof data === "object") data = JSON.stringify(data);
  if (typeof key === "object") key = key.toString();
  return await Redis.set(key, data);
};

export const setRedisEx = async (key: any, data: any, duration: any) => {
  if (typeof data === "object") data = JSON.stringify(data);
  if (typeof key === "object") key = key.toString();
  return await Redis.setEx(key, duration, data);
};

export const getRedis = async (key: any, parse = false) => {
  try {
    if (!key) throw new Error("Redis Cache Key Not Found");
    const data = (await Redis.get(key)) as any;
    return parse ? JSON.parse(data) : data;
  } catch (err:any) {
    throw new Error(err);
  }
};

export const delRedis = async (key: any) => {
  try {
    if (!key) return false;
    return await Redis.del(key);
  } catch (err:any) {
    throw new Error(err);
  }
};

export function globalErrorHandler(err: Error): void {
  console.log("=======Unhandled error=======/n/n", err);
}

export function devLog(...keys: any): void {
  if (process.env.NODE_ENV !== "production") {
    const title = typeof keys[0] === "string" ? keys.shift() : "Log start";
    console.log(
      `\n\n\n=============${title}\n${new Date()}===================\n`
    );
    keys.forEach((log: any) => console.log(log));
    console.log("\n==============Log end==================\n");
  }
}

export function parseJSON(value: any): any {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

module.exports = {
  startKafka,
  publishEvent,
  producer,
  subscriber,
  mysqlDb,
  SELECT_QUERY_TYPE,
  UPDATE_QUERY_TYPE,
  INSERT_QUERY_TYPE,
  DELETE_QUERY_TYPE,
  uuid,
  DataTypes,
  Op,
  startMongo,
  model,
  Schema,
  parseJSON,
  devLog,
  globalErrorHandler,
};
