import { createClient } from "redis";

const Redis = createClient({url:process.env.REDIS_URL}
);

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

export default Redis;