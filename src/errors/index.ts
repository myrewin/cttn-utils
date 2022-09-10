import { devLog } from "../utils/index.js";

export class ValidationError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "VALIDATION_ERROR";
    this.httpStatusCode = 400;
  }
}
export class ExistsError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ENTRY_EXISTS";
    this.httpStatusCode = 409;
  }
}

export class NotFoundError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ENTRY_NOT_FOUND";
    this.httpStatusCode = 404;
  }
}

export class AuthenticationError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "AUTHENTICATION_ERROR";
    this.httpStatusCode = 401;
  }
}

export class AuthorizationError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "AUTHORISATION_ERROR";
    this.httpStatusCode = 403;
  }
}

export class TokenExpiredError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "TOKEN_EXPIRED";
    this.httpStatusCode = 401;
  }
}

export class InvalidTokenError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "TOKEN_INVALID";
    this.httpStatusCode = 401;
  }
}

export class PaymentRequiredError extends Error {
  httpStatusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "PAYMENT_REQUIRED";
    this.httpStatusCode = 402;
  }
}

export const HTTP_STATUS_CODE_ERROR: any = {
  "400": "VALIDATION_ERROR",
  "401": "AUTHENTICATION_ERROR",
  "402": "PAYMENT_REQUIRED_ERROR",
  "403": "AUTHORISATION_ERROR",
  "404": "ENTRY_NOT_FOUND",
  "409": "ENTRY_EXISTS",
  "500": "FATAL_ERROR",
};

export const customErrorMessage = ({
  err = 0,
  ERROR_TYPE = "FATAL_ERROR",
}: {
  err: any;
  ERROR_TYPE: string;
}) => {
  let message;
  if (err && err.errors)
    message = err.errors[0] ? err.errors[0].message : "Something went wrong.";
  else if (err && err.message) message = err.message;
  else if (typeof err == "string") message = err;
  else message = "Something went wrong";

  if (process.env.NODE_ENV !== "production") devLog(err);

  const response = { success: false, message, ...err };
  response.error =
    err.name || HTTP_STATUS_CODE_ERROR[err.httpStatusCode] || ERROR_TYPE;
  if (err.httpStatusCode) response.httpStatusCode = err.httpStatusCode;
  response.service =
    err.service || process.env.APP_NAME || process.env.SERVICE_NAME;
  return response;
};

export const errorMessage = (err: any = void 0, ERROR_TYPE = "FATAL_ERROR") => {
  try {
    let message: string;
    if (err && err.errors)
      message = err.errors[0] ? err.errors[0].message : "Something went wrong.";
    else if (err && err.message) message = err.message;
    else if (typeof err == "string") message = err;
    else message = "Something went wrong";

    if (process.env.NODE_ENV !== "production") devLog(err);

    const response: any = { success: false, message };
    response.error =
      err.name || HTTP_STATUS_CODE_ERROR[err.httpStatusCode] || ERROR_TYPE;
    if (err.httpStatusCode) response.httpStatusCode = err.httpStatusCode;
    response.service =
      err.service || process.env.APP_NAME || process.env.SERVICE_NAME;

    if (err.isAxiosError) {
      response.message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      response.httpStatusCode =
        err?.response?.data?.httpStatusCode || err?.response?.status;
      response.error =
        err?.response?.data?.error ||
        HTTP_STATUS_CODE_ERROR[response.httpStatusCode] ||
        ERROR_TYPE;
    }

    return response;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Something went wrong",
      error: ERROR_TYPE,
      service: err.service || process.env.APP_NAME || process.env.SERVICE_NAME,
      httpStatusCode: 500,
    };
  }
};
