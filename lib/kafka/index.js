import { randomUUID as uuid } from "crypto";
import { Kafka, } from "kafkajs";
import { devLog, parseJSON } from "../utils";
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
export const startKafka = async (topics) => {
    await admin.connect();
    await admin.createTopics({
        topics,
    });
};
export const publishEvent = async ({ topic, message, producer, headers, token, }) => {
    try {
        await producer.connect();
        if (token) {
            if (!headers)
                headers = { authorization: token };
            else
                headers = { ...headers, authorization: token };
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
    }
    catch (err) {
        devLog(err);
        return false;
    }
    finally {
        await producer.disconnect();
    }
};
export const producer = (config) => {
    config = config || {};
    config.idempotent = config?.idempotent || true;
    config.allowAutoTopicCreation = config?.allowAutoTopicCreation || true;
    return kafka.producer(config);
};
const getToken = ({ headers }) => headers?.authorization ? headers.authorization.toString() : null;
const getValue = ({ value }) => {
    if (value)
        return parseJSON(value.toString());
};
const getKey = ({ key }) => key?.toString();
export const subscriber = async ({ groupId = uuid(), topic, fromBeginning = false, cb, }) => {
    const consumer = kafka.consumer({ groupId });
    await consumer.subscribe({ topic, fromBeginning });
    consumer.run({
        eachMessage: async ({ message, partition, topic }) => {
            cb({ message, partition, topic, getKey, getToken, getValue });
        },
    });
};
