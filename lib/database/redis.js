import { createClient } from "redis";
const Redis = createClient(process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
    });
Redis.on("connect", () => console.log("Redis is connected")).on("error", (err) => console.log(err));
export const setRedis = async (key, data) => {
    if (typeof data === "object")
        data = JSON.stringify(data);
    if (typeof key === "object")
        key = key.toString();
    return await Redis.set(key, data);
};
export const setRedisEx = async (key, data, duration) => {
    if (typeof data === "object")
        data = JSON.stringify(data);
    if (typeof key === "object")
        key = key.toString();
    return await Redis.setEx(key, duration, data);
};
export const getRedis = async (key, parse = false) => {
    try {
        if (!key)
            throw new Error("Redis Cache Key Not Found");
        const data = (await Redis.get(key));
        return parse ? JSON.parse(data) : data;
    }
    catch (err) {
        throw new Error(err);
    }
};
export const delRedis = async (key) => {
    try {
        if (!key)
            return false;
        return await Redis.del(key);
    }
    catch (err) {
        throw new Error(err);
    }
};
export default Redis;
