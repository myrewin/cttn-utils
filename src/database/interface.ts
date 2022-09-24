import { KafkaConfig, KafkaMessage, ProducerConfig } from "kafkajs";

export interface KafkaPublishInt {
  message: Record<string, any>;
  topic: string;
  headers?: Record<string, any>;
  token?: string;
}

interface CttnMessageHander {
  topic?: string;
  partition?: number;
  message: KafkaMessage;
  getToken?: Function;
  getValue?: Function;
  getKey?: Function;
}

export interface ConsumerInt {
  groupId: string;
  topic: string;
  fromBeginning: boolean;
  cb(obj: CttnMessageHander): Promise<void>;
}

export interface KafkaBasicConfig {
  username: string;
  password: string;
  brokers: string[];
  ssl: boolean;
}

export interface KafkaInt {
  config: KafkaConfig | KafkaBasicConfig;
  producerConfig?: ProducerConfig;
}
