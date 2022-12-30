import Ioredis from "ioredis";

import { ValidationError } from "../errors/index.js";
import { parseJSON } from "../utils/index.js";

export class Redis {
  private client;

  constructor(url: string) {
    this.client = new Ioredis(url);
  }

  async start() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async set(key: string, data: any): Promise<any> {
    if (!key || typeof key !== "string")
      throw new ValidationError("Redis key must be a string");

    if (typeof data !== "number" || typeof data !== "string")
      data = JSON.stringify(data);
    return await this.client.set(key, data);
  }

  async setEx(key: string, data: any, duration: number | string): Promise<any> {
    if (!key || typeof key !== "string")
      throw new ValidationError("Redis key must be a string");

    if (typeof data !== "number" || typeof data !== "string")
      data = JSON.stringify(data);

    if (typeof duration === "string") {
      let [value, unit] = duration.split(" ") as any;
      value = Number(value);
      if (unit === "days" || unit === "day") {
        duration = 60 * 60 * 24 * value;
      } else if (unit === "minutes" || unit === "minute") {
        duration = 60 * value;
      } else if (unit === "hours" || unit === "hour") {
        duration = 60 * 60 * value;
      }
    }
    return await this.client.setex(key, duration as number, data);
  }

  async get(key: string, parse: boolean = true): Promise<any> {
    if (!key || typeof key !== "string")
      throw new ValidationError("Redis key must be a string");

    const data = (await this.client.get(key)) as any;
    return parse ? parseJSON(data) : data;
  }

  async delete(key: string): Promise<boolean> {
    if (!key || typeof key !== "string")
      throw new ValidationError("Redis key must be a string");

    return Boolean(await this.client.del(key));
  }
}