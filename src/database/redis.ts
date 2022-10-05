import { RedisClientOptions, createClient } from "redis";
import { ValidationError } from "../errors";
import { parseJSON } from "../utils";

export class Redis {
  private client;

  constructor(url: string) {
    this.client = createClient({ url });
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
      if (unit === "days") {
        duration = 60 * 60 * 24 * value;
      } else if (unit === "minutes") {
        duration = 60 * value;
      } else if (unit === "hours") {
        duration = 60 * 60 * value;
      }
    }
    return await this.client.setEx(key, duration as number, data);
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

export default Redis;
