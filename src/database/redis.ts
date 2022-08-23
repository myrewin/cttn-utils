import { createClient } from "redis";
import { ValidationError } from "../errors/index.js";
import { parseJSON } from "../utils/index.js";

export const Redis = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD || ""}@${
    process.env.REDIS_HOST
  }:${process.env.REDIS_PORT}`,
});

export const setRedis = async (key: string, data: any): Promise<any> => {
  if (!key || typeof key === "string")
    throw new ValidationError("Redis key must be a string");

  if (typeof data === "object") data = JSON.stringify(data);
  return await Redis.set(key, data);
};

export const setRedisEx = async (
  key: string,
  data: any,
  duration: number
): Promise<any> => {
  if (!key || typeof key === "string")
    throw new ValidationError("Redis key must be a string");

  if (typeof data === "object") data = JSON.stringify(data);
  return await Redis.setEx(key, duration, data);
};

export const getRedis = async (
  key: string,
  parse: boolean = true
): Promise<any> => {
  if (!key || typeof key === "string")
    throw new ValidationError("Redis key must be a string");

  const data = (await Redis.get(key)) as any;
  return parse ? parseJSON(data) : data;
};

export const delRedis = async (key: string): Promise<boolean> => {
  if (!key || typeof key === "string")
    throw new ValidationError("Redis key must be a string");

  return Boolean(await Redis.del(key));
};

export default Redis;
