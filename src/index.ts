import { randomUUID } from "crypto";

export const uuid = () => randomUUID();

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
