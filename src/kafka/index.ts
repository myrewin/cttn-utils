import { randomUUID as uuid } from "crypto";

import {
  ITopicConfig,
  Kafka,
  KafkaMessage,
  MessageSetEntry,
  Producer,
} from "kafkajs";

import { devLog, parseJSON } from "..";

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const admin = kafka.admin();

export const startKafka = async (topics: [ITopicConfig]): Promise<void> => {
  await admin.connect();
  await admin.createTopics({
    topics,
  });
};

export const publishEvent = async ({
  topic,
  message,
  producer,
  headers,
  token,
}: {
  message: Record<string, any>;
  topic: string;
  producer: Producer;
  headers?: Record<string, any>;
  token?: string;
}): Promise<boolean> => {
  try {
    await producer.connect();

    if (token) {
      if (!headers) headers = { authorization: token };
      else headers = { ...headers, authorization: token };
    }

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
          key: uuid(),
          headers,
        },
      ],
    });
    return true;
  } catch (err) {
    devLog(err);
    return false;
  } finally {
    await producer.disconnect();
  }
};

declare type KProducer = (config: {
  allowAutoTopicCreation?: boolean;
  idempotent?: boolean;
  transactionalId?: string;
  transactionTimeout?: number;
}) => Producer;

export const producer: KProducer = (config) => {
  config = config || {};
  config.idempotent = config?.idempotent || true;
  config.allowAutoTopicCreation = config?.allowAutoTopicCreation || true;

  return kafka.producer(config);
};

interface CttnMessageHander {
  topic: string;
  partition: number;
  message: KafkaMessage;
  getToken?: Function;
  getValue?: Function;
  getKey?: Function;
}

const getToken = ({ headers }: any): string =>
  headers?.authorization ? headers.authorization.toString() : null;

const getValue = ({ value }: MessageSetEntry): Record<string, any> =>
  parseJSON(value?.toString());

const getKey = ({ key }: MessageSetEntry): any => key?.toString();

export const subscriber = async ({
  groupId = uuid(),
  topic,
  fromBeginning = false,
  cb,
}: {
  groupId: string;
  topic: string;
  fromBeginning: boolean;
  cb(obj: CttnMessageHander): Promise<void>;
}): Promise<void> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.subscribe({ topic, fromBeginning });
  consumer.run({
    eachMessage: async ({ message, partition, topic }) => {
      cb({ message, partition, topic, getKey, getToken, getValue });
    },
  });
};
