import { KafkaMessage, Producer } from "kafkajs";
export interface PublishEventInterface {
    message: Record<string, any>;
    topic: string;
    producer: Producer;
    headers?: Record<string, any>;
    token?: string;
}
export interface KProducerInterface {
    allowAutoTopicCreation?: boolean;
    idempotent?: boolean;
    transactionalId?: string;
    transactionTimeout?: number;
}
interface CttnMessageHander {
    topic: string;
    partition: number;
    message: KafkaMessage;
    getToken?: Function;
    getValue?: Function;
    getKey?: Function;
}
export interface SubscriberInterface {
    groupId: string;
    topic: string;
    fromBeginning: boolean;
    cb(obj: CttnMessageHander): Promise<void>;
}
export {};
//# sourceMappingURL=interface.d.ts.map