export { Schema as mongoSchema, model as mongoModel } from "mongoose";

export {
  AuthorizationError,
  EntryExistError,
  EntryNotFoundError,
  AuthenticationError,
  InvalidTokenError,
  TokenExpiredError,
  PaymentRequiredError,
  ValidationError,
} from "./errors/index.js";
export {
  getContent,
  postContent,
  paginate,
  decodeJwt,
  deleteFile,
  encodeJwt,
  slugify,
  uploadFile,
  joiValidator,
  parseJSON,
  globalErrorHandler,
  devLog,
  uuid,
} from "./utils/index.js";

export { mongoStart } from "./database/mongoDb.js";
export { setRedis, setRedisEx, getRedis, delRedis } from "./database/redis.js";
export {
  SQL_DELETE_QUERY_TYPE,
  SQL_DataTypes,
  SQL_INSERT_QUERY_TYPE,
  SQL_SELECT_QUERY_TYPE,
  SQL_UPDATE_QUERY_TYPE,
  SQL_initDb,
} from "./database/sqlDb.js";

// module.exports = {
//   parseJSON,
//   globalErrorHandler,
//   devLog,
//   postContent,
//   getContent,
//   decodeJwt,
//   encodeJwt,
//   paginate,
//   slugify,
//   deleteFile,
//   uploadFile,
//   joiValidator,
//   uuid,

//   //Redis
//   setRedis,
//   setRedisEx,
//   getRedis,
//   delRedis,

//   //MySQl
//   SQL_DELETE_QUERY_TYPE,
//   SQL_DataTypes,
//   SQL_INSERT_QUERY_TYPE,
//   SQL_SELECT_QUERY_TYPE,
//   SQL_UPDATE_QUERY_TYPE,
//   SQL_initDb,

//   //Mongo DB
//   mongoStart,
//   mongoSchema: Schema,
//   mongoModel: model,

//   //Errors
//   InvalidTokenError: InvalidTokenError,
//   TokenExpiredError: TokenExpiredError,
//   AuthenticationError: AuthenticationError,
//   AuthorizationError: AuthorizationError,
//   EntryExistError: EntryExistError,
//   EntryNotFoundError: EntryNotFoundError,
//   NotFoundError: EntryNotFoundError,
//   ExistsError: EntryExistError,
//   ValidationError: ValidationError,
//   PaymentRequiredError: PaymentRequiredError,
// };
