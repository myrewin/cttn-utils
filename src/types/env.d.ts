export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KAFKA_BROKER: string;
      KAFKA_USERNAME: string;
      KAFKA_PASSWORD: string;
    }
  }
}
