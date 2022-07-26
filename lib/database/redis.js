"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delRedis = exports.getRedis = exports.setRedisEx = exports.setRedis = void 0;
const redis_1 = require("redis");
const Redis = (0, redis_1.createClient)(process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
    });
Redis.on("connect", () => console.log("Redis is connected")).on("error", (err) => console.log(err));
const setRedis = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof data === "object")
        data = JSON.stringify(data);
    if (typeof key === "object")
        key = key.toString();
    return yield Redis.set(key, data);
});
exports.setRedis = setRedis;
const setRedisEx = (key, data, duration) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof data === "object")
        data = JSON.stringify(data);
    if (typeof key === "object")
        key = key.toString();
    return yield Redis.setEx(key, duration, data);
});
exports.setRedisEx = setRedisEx;
const getRedis = (key, parse = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!key)
            throw new Error("Redis Cache Key Not Found");
        const data = (yield Redis.get(key));
        return parse ? JSON.parse(data) : data;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.getRedis = getRedis;
const delRedis = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!key)
            return false;
        return yield Redis.del(key);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.delRedis = delRedis;
exports.default = Redis;
//# sourceMappingURL=redis.js.map