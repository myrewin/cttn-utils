import { ITopicConfig, Producer } from "kafkajs";
import { KProducerInterface, PublishEventInterface, SubscriberInterface } from "./interface";
export declare const startKafka: (topics: [ITopicConfig]) => Promise<void>;
export declare const publishEvent: ({ topic, message, producer, headers, token, }: PublishEventInterface) => Promise<boolean>;
declare type KProducer = (config: KProducerInterface) => Producer;
export declare const producer: KProducer;
export declare const subscriber: ({ groupId, topic, fromBeginning, cb, }: SubscriberInterface) => Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map