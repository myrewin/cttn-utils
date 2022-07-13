export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KAFKA_BROKER: string;
      KAFKA_USERNAME: string;
      KAFKA_PASSWORD: string;
      DB_HOST: string;
      DB_USERNAME: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      MONGO_URI: string;
      REDIS_HOST:string;
      REDIS_PORT: number;
      REDIS_PASSWORD:string
    }
  }
}
