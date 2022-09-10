export declare const startRedis: () => Promise<void>;
export declare const setRedis: (key: string, data: any) => Promise<any>;
export declare const setRedisEx: (
  key: string,
  data: any,
  duration: number
) => Promise<any>;
export declare const getRedis: (key: string, parse?: boolean) => Promise<any>;
export declare const delRedis: (key: string) => Promise<boolean>;
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
export declare const kafka: Kafka;
export declare const startKafka: (topics: Array<ITopicConfig>) => Promise<void>;
export declare const publishEvent: ({
  topic,
  message,
  producer,
  headers,
  token,
}: PublishEventInterface) => Promise<boolean>;
declare type KProducer = (config: KProducerInterface) => Producer;
export declare const producer: KProducer;
export declare const subscriber: ({
  groupId,
  topic,
  fromBeginning,
  cb,
}: SubscriberInterface) => Promise<void>;
export declare const fileExists: (file: any) => Promise<unknown>;
export declare const shuffelWord: (word: any) => string;
export declare const deleteFile: (file: any) => Promise<boolean>;
export declare function joiValidator(
  constraint: any,
  isMiddleware?: boolean
): any;
export declare const randomString: (N?: number) => string;
export declare const uniqueString: (capitalize?: boolean) => string;
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
export declare const slugify: ({
  value,
  lowerCase,
}: {
  value: string;
  lowerCase: boolean;
}) => string;
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
) => object;
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
export declare function globalErrorHandler(err: Error): void;
export declare function devLog(...keys: any): void;
export declare function parseJSON(value: string): any;
export declare const uuid: {
  toBinary: (uuid: string) => object;
  toString: (binary: any) => string;
  mysqlBinary: (value: any) => object;
  mysqlUUID: (field: any) => object;
  get: () => string;
  isValid: (uuid: string) => boolean;
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
