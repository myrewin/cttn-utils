import {
  AuthorizationError,
  EntryExistError,
  EntryNotFoundError,
  AuthenticationError,
  InvalidTokenError,
  TokenExpiredError,
  PaymentRequiredError,
  ValidationError,
} from "./errors";
import { setRedis, setRedisEx, getRedis, delRedis } from "./database/redis";
import { startMongo } from "./database/mongoDb";
import { model, Schema } from "mongoose";
import { DataTypes } from "sequelize";
import { parseJSON, globalErrorHandler, devLog } from "../src/utils";
import {
  SQL_DELETE_QUERY_TYPE,
  SQL_INSERT_QUERY_TYPE,
  SQL_SELECT_QUERY_TYPE,
  SQL_UPDATE_QUERY_TYPE,
  initDB,
  uuid,
} from "./database/sqlDb";
import {
  getContent,
  postContent,
  paginate,
  decodeJwt,
  deleteFile,
  encodeJwt,
  slugify,
  uploadFile,
  joiValidator,
} from "./utils";

module.exports = {
  parseJSON,
  globalErrorHandler,
  devLog,
  postContent,
  getContent,
  decodeJwt,
  encodeJwt,
  paginate,
  slugify,
  deleteFile,
  uploadFile,
  joiValidator,
  InvalidTokenError: InvalidTokenError,
  TokenExpiredError: TokenExpiredError,
  AuthenticationError: AuthenticationError,
  AuthorizationError: AuthorizationError,
  EntryExistError: EntryExistError,
  EntryNotFoundError: EntryNotFoundError,
  NotFoundError: EntryNotFoundError,
  ExistsError: EntryExistError,
  ValidationError: ValidationError,
  PaymentRequiredError: PaymentRequiredError,
  setRedis,
  setRedisEx,
  getRedis,
  delRedis,
  uuid,
  mongoDbModel: model,
  mongoDbSchema: Schema,
  startMongo,
  initSqlDB: initDB,
  SQL_DataTypes: DataTypes,
  SQL_DELETE_QUERY_TYPE,
  SQL_INSERT_QUERY_TYPE,
  SQL_UPDATE_QUERY_TYPE,
  SQL_SELECT_QUERY_TYPE,
};
