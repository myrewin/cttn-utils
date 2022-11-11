import { KafkaMessage } from "kafkajs";

export declare class ValidationError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class ExistsError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class NotFoundError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class AuthenticationError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class AuthorizationError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class TokenExpiredError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class InvalidTokenError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare class PaymentRequiredError extends Error {
  httpStatusCode: number;
  constructor(message: string);
}
export declare const HTTP_STATUS_CODE_ERROR: any;
export declare const customErrorMessage: ({
  err,
  ERROR_TYPE,
}: {
  err: any;
  ERROR_TYPE: string;
}) => any;
export declare const errorMessage: (err?: any, ERROR_TYPE?: string) => any;

export declare const fileExists: (file: any) => Promise<unknown>;
export declare const shuffelWord: (word: any) => string;
export declare const deleteFile: (file: any) => Promise<boolean>;
export declare function joiValidator(
  constraint: any,
  isMiddleware?: boolean
): any;
export declare const randomString: (N?: number) => string;
export declare const uniqueString: (capitalize?: boolean) => string;
export declare const base64ToFile: (
  base64String: any,
  path: any
) => Promise<unknown>;
export declare const createPath: (path: any) => Promise<unknown>;
export declare const uploadFile: ({
  name,
  limit,
  allowedFormat,
  location,
}: {
  name?: string | undefined;
  limit?: number | undefined;
  allowedFormat?: any[] | undefined;
  location?: string | undefined;
}) => any;
export declare const slugify: (
  text: string,
  options?: { lowerCase: boolean }
) => string;
export declare const getContent: ({
  url,
  method,
  headers,
  token,
  data,
}: {
  url: string;
  method?: "GET" | "DELETE" | undefined;
  headers?: Record<string, any> | undefined;
  token?: string | undefined;
  data?: Record<string, any> | undefined;
}) => Promise<AxiosResponse>;
export declare const postContent: ({
  url,
  token,
  data,
  method,
  headers,
}: {
  url: string;
  token?: string | undefined;
  data?: Record<string, any> | undefined;
  method?: "POST" | "PATCH" | undefined;
  headers?: Record<string, any> | undefined;
}) => Promise<AxiosResponse>;
export declare const paginate: (
  totalCount: number,
  currentPage: number,
  perPage: number
) => Record<string, any>;
export declare const decodeJwt: (
  cipher: any,
  secreteKey: string
) => Promise<any>;
export declare const encodeJwt: ({
  data,
  secreteKey,
  duration,
}: {
  data: any;
  secreteKey: string;
  duration: string;
}) => Promise<any>;

export declare function urlQueryToString(query: any): string;
export declare function rand(min: number, max: number): number;

export declare function globalErrorHandler(err: Error): void;
export declare function devLog(...keys: any): void;
export declare function parseJSON(value: string): any;
export declare const uuid: {
  toBinary: (uuid: string) => object | any;
  toString: (binary: any) => string;
  mysqlBinary: (value: any) => object | any;
  mysqlUUID: (field: any) => object | any;
  get: () => string;
  isValid: (uuid: string) => boolean;
  manyToString: (data: any, keys: any) => any;
  manyToBinary: (data: any, keys: any) => any;
};
export declare const fileManager: {
  upload: (
    location?: string
  ) => (req: Request | any, res: Response, next: NextFunction) => Promise<any>;
  uploadBase64: (file: any) => Promise<string>;
  remove: (fileUrl: string | Array<string>) => Promise<void>;
  resizeImage: (
    fileUrl: string,
    width: number | undefined,
    height: number
  ) => Promise<AxiosResponse>;
  exists: (fileUrl: string) => Promise<AxiosResponse>;
  url: (relativeUrl: string) => string;
};

//DB interface
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

//Kafka class
export declare class Kafka {
  client: Kafkajs;
  private producer;
  constructor({ config, producerConfig }: KafkaInt);
  createProducer(config?: ProducerConfig): Producer;
  start(): Promise<void>;
  publish({ topic, message, headers, token }: KafkaPublishInt): Promise<void>;
  private getValue;
  private getKey;
  private getToken;
  createConsumer({
    groupId,
    topic,
    fromBeginning,
    cb,
  }: ConsumerInt): Promise<void>;
  disconnect(): Promise<void>;
}

//Redis
export declare class Redis {
  private client;
  constructor(url: string);
  start(): Promise<void>;
  disconnect(): Promise<void>;
  set(key: string, data: any): Promise<any>;
  setEx(key: string, data: any, duration: number | string): Promise<any>;
  get(key: string, parse?: boolean): Promise<any>;
  delete(key: string): Promise<boolean>;
}
