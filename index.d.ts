import { KafkaMessage, Producer } from "kafkajs";
import {Schema, model} from 'mongoose'
import {Sequelize, DataTypes} from 'sequelize'

//Kafka
export declare const startKafka: (topics: Array<string>) => Promise<void>;
export declare const publishEvent: (obj: {
  message: Record<string, any>;
  topic: string;
  producer: Producer;
  headers?: Record<string, any>;
  token?: string;
}) => Promise<boolean>;
export declare const producer: (config: {
  allowAutoTopicCreation?: boolean;
  idempotent?: boolean;
  transactionalId?: string;
  transactionTimeout?: number;
}) => Producer;

export declare const subscriber: (obj: {
  groupId: string;
  topic: string;
  fromBeginning: boolean;
  cb(obj: {
    topic: string;
    partition: number;
    message: KafkaMessage;
    getValue?: Function;
  }): Promise<void>;
}) => Promise<void>;

//Database
export const mongoDbModel = model;
export declare const mongoStart =()=>Promise<void>
export const mongoDbSchema = Schema;
export const SQL_SELECT_QUERY_TYPE = { type: QueryTypes.SELECT };
export const SQL_INSERT_QUERY_TYPE = { type: QueryTypes.INSERT };
export const SQL_UPDATE_QUERY_TYPE = { type: QueryTypes.UPDATE };
export const SQL_DELETE_QUERY_TYPE = { type: QueryTypes.DELETE };
export const SQL_initDb = Sequelize;
export const SQL_DataTypes = DataTypes;

//Utils
export declare function parseJSON(value: any): any;
export declare function globalErrorHandler(err: Error): void;
export declare function devLog(...keys: any): void;
export declare const postContent: (obj: {
  url: string;
  token?: string;
  data?: Record<string, any>;
  method?: "POST" | "PATCH";
  headers?: Record<string, any>;
}) => Promise<any>;
export declare const getContent: (obj: {
  url: string;
  method?: "GET";
  headers?: Record<string, any>;
  token?: string;
  data?: Record<string, any>;
}) => Promise<any>;
export const slugify: (obj: { value: string; lowerCase: boolean }) => string;
export const uploadFile: (obj: {
  name?: string;
  limit?: number;
  allowedFormat?: Record<string, any>;
  location?: string;
}) => any;
export const paginate: (
  totalCount: number,
  currentPage: number,
  perPage: number
) => { pageCount: number; offset: number };
export const joiValidator: (constraint: any, isMiddleware: boolean) => any;
export const deleteFile: (file: any) => boolean;
export declare const decodeJwt: (
  cipher: string,
  secreteKey: string
) => Promise<any>;

export declare const encodeJwt: (obj: {
  data: any;
  secreteKey: string;
  duration: string | number;
}) => Promise<any>;

//Redis
export declare const setRedis: (key: any, data: any) => Promise<string>;
export declare const setRedisEx: (
  key: any,
  data: any,
  duration: any
) => Promise<string>;
export declare const getRedis: (key: any) => Promise<any>;
export declare const delRedis: (key: any) => Promise<any>;
export declare const uuid: {
  toBinary: (uuid: string) => object;
  toString: (binary: any) => string;
  mysqlBinary: (value: any) => object;
  mysqlUUID: (field: any) => object;
  get: () => string;
  isValid: (uuid: string) => boolean;
};

//Errors
export class InvalidTokenError extends Error {}
export class TokenExpiredError extends Error {}
export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}
export class EntryExistError extends Error {}
export class EntryNotFoundError extends Error {}
export class NotFoundError extends Error {}
export class ExistsError extends Error {}
export class ValidationError extends Error {}
export class PaymentRequiredError extends Error {}
