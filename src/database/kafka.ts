import {
  Kafka as Kafkajs,
  KafkaConfig,
  MessageSetEntry,
  Partitioners,
  Producer,
  ProducerConfig,
  RecordMetadata,
} from "kafkajs";
import { devLog, parseJSON, uuid } from "../utils/index.js";
import {
  ConsumerInt,
  KafkaBasicConfig,
  KafkaInt,
  KafkaPublishInt,
} from "./interface.js";

export class Kafka {
  client;
  private producer: Producer;
  private defaultConfig: KafkaBasicConfig | KafkaConfig;

  constructor({ config, producerConfig }: KafkaInt) {
    this.defaultConfig = config;

    if ("username" in config) {
      this.defaultConfig = {
        brokers: config.brokers,
        sasl: {
          mechanism: "scram-sha-256",
          username: config.username,
          password: config.password,
        },
        ssl: true,
      };
    }

    devLog("Config data", {
      default: this.defaultConfig,
      config,
    });

    this.client = new Kafkajs(this.defaultConfig);

    this.producer = this.createProducer(producerConfig);
  }

  public createProducer(config?: ProducerConfig): Producer {
    let defaultConfig: ProducerConfig = {
      idempotent: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    };

    if (config) defaultConfig = { ...defaultConfig, ...config };

    return this.client.producer(defaultConfig);
  }

  public async start(): Promise<void> {
    await this.producer.connect();
  }

  async publish({
    topic,
    message,
    headers,
    token,
  }: KafkaPublishInt): Promise<RecordMetadata[]> {
    try {
      if (token) {
        if (!headers) headers = { authorization: token };
        else headers = { ...headers, authorization: token };
      }

      const res = await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            key: uuid.get(),
            headers,
          },
        ],
      });

      if (process.env.NODE_ENV !== "production")
        devLog(`${topic} published`, message);

      return res;
    } catch (err) {
      devLog(`${topic} producer error`, err);
      throw err;
    }
  }

  private getValue = ({ value }: MessageSetEntry): any => {
    if (value) return parseJSON(value.toString());
  };

  private getKey = ({ key }: MessageSetEntry): any => key?.toString();

  private getToken = ({ headers }: any): string =>
    headers?.authorization ? headers.authorization.toString() : null;

  async createConsumer({
    groupId = uuid.get(),
    topic,
    fromBeginning = false,
    cb,
  }: ConsumerInt): Promise<void> {
    const consumer = this.client.consumer({ groupId });
    await consumer.subscribe({ topic, fromBeginning });
    consumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        cb({
          message,
          partition,
          topic,
          getValue: this.getValue,
          getKey: this.getKey,
          getToken: this.getToken,
        });
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}

export default Kafka;
