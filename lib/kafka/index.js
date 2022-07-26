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
exports.subscriber = exports.producer = exports.publishEvent = exports.startKafka = void 0;
const crypto_1 = require("crypto");
const kafkajs_1 = require("kafkajs");
const utils_1 = require("../utils");
const kafka = new kafkajs_1.Kafka({
    brokers: [process.env.KAFKA_BROKER],
    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
    ssl: true,
});
const admin = kafka.admin();
const startKafka = (topics) => __awaiter(void 0, void 0, void 0, function* () {
    yield admin.connect();
    yield admin.createTopics({
        topics,
    });
});
exports.startKafka = startKafka;
const publishEvent = ({ topic, message, producer, headers, token, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield producer.connect();
        if (token) {
            if (!headers)
                headers = { authorization: token };
            else
                headers = Object.assign(Object.assign({}, headers), { authorization: token });
        }
        yield producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                    key: (0, crypto_1.randomUUID)(),
                    headers,
                },
            ],
        });
        return true;
    }
    catch (err) {
        (0, utils_1.devLog)(err);
        return false;
    }
    finally {
        yield producer.disconnect();
    }
});
exports.publishEvent = publishEvent;
const producer = (config) => {
    config = config || {};
    config.idempotent = (config === null || config === void 0 ? void 0 : config.idempotent) || true;
    config.allowAutoTopicCreation = (config === null || config === void 0 ? void 0 : config.allowAutoTopicCreation) || true;
    return kafka.producer(config);
};
exports.producer = producer;
const getToken = ({ headers }) => (headers === null || headers === void 0 ? void 0 : headers.authorization) ? headers.authorization.toString() : null;
const getValue = ({ value }) => {
    if (value)
        return (0, utils_1.parseJSON)(value.toString());
};
const getKey = ({ key }) => key === null || key === void 0 ? void 0 : key.toString();
const subscriber = ({ groupId = (0, crypto_1.randomUUID)(), topic, fromBeginning = false, cb, }) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = kafka.consumer({ groupId });
    yield consumer.subscribe({ topic, fromBeginning });
    consumer.run({
        eachMessage: ({ message, partition, topic }) => __awaiter(void 0, void 0, void 0, function* () {
            cb({ message, partition, topic, getKey, getToken, getValue });
        }),
    });
});
exports.subscriber = subscriber;
//# sourceMappingURL=index.js.map