"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = exports.customErrorMessage = exports.HTTP_STATUS_CODE_ERROR = exports.PaymentRequiredError = exports.InvalidTokenError = exports.TokenExpiredError = exports.AuthorizationError = exports.AuthenticationError = exports.EntryNotFoundError = exports.EntryExistError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "VALIDATION_ERROR";
        this.httpStatusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class EntryExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "ENTRY_EXISTS";
        this.httpStatusCode = 409;
    }
}
exports.EntryExistError = EntryExistError;
class EntryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ENTRY_NOT_FOUND";
        this.httpStatusCode = 404;
    }
}
exports.EntryNotFoundError = EntryNotFoundError;
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AUTHENTICATION_ERROR";
        this.httpStatusCode = 401;
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AUTHORISATION_ERROR";
        this.httpStatusCode = 403;
    }
}
exports.AuthorizationError = AuthorizationError;
class TokenExpiredError extends Error {
    constructor(message) {
        super(message);
        this.name = "TOKEN_EXPIRED";
        this.httpStatusCode = 401;
    }
}
exports.TokenExpiredError = TokenExpiredError;
class InvalidTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "TOKEN_INVALID";
        this.httpStatusCode = 401;
    }
}
exports.InvalidTokenError = InvalidTokenError;
class PaymentRequiredError extends Error {
    constructor(message) {
        super(message);
        this.name = "PAYMENT_REQUIRED";
        this.httpStatusCode = 402;
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
exports.HTTP_STATUS_CODE_ERROR = {
    "400": "VALIDATION_ERROR",
    "401": "AUTHENTICATION_ERROR",
    "402": "PAYMENT_REQUIRED_ERROR",
    "403": "AUTHORISATION_ERROR",
    "404": "ENTRY_NOT_FOUND",
    "409": "ENTRY_EXISTS",
    "500": "FATAL_ERROR",
};
const customErrorMessage = ({ err = 0, ERROR_TYPE = "FATAL_ERROR", }) => {
    let message;
    if (err && err.errors)
        message = err.errors[0] ? err.errors[0].message : "Something went wrong.";
    else if (err && err.message)
        message = err.message;
    else if (typeof err == "string")
        message = err;
    else
        message = "Something went wrong";
    if (process.env.NODE_ENV !== "production") {
        console.log("=======================================");
        console.log(err);
        console.log("=======================================");
    }
    const response = Object.assign({ success: false, message }, err);
    response.error =
        err.name || exports.HTTP_STATUS_CODE_ERROR[err.httpStatusCode] || ERROR_TYPE;
    if (err.httpStatusCode)
        response.httpStatusCode = err.httpStatusCode;
    response.service =
        err.service || process.env.APP_NAME || process.env.SERVICE_NAME;
    return response;
};
exports.customErrorMessage = customErrorMessage;
const errorMessage = ({ err = void 0, ERROR_TYPE = "FATAL_ERROR", }) => {
    let message;
    if (err && err.errors)
        message = err.errors[0] ? err.errors[0].message : "Something went wrong.";
    else if (err && err.message)
        message = err.message;
    else if (typeof err == "string")
        message = err;
    else
        message = "Something went wrong";
    if (process.env.NODE_ENV !== "production") {
        console.log("=======================================");
        console.log(err);
        console.log("=======================================");
    }
    const response = { success: false, message };
    response.error =
        err.name || err.HTTP_STATUS_CODE_ERROR[err.httpStatusCode] || ERROR_TYPE;
    if (err.httpStatusCode)
        response.httpStatusCode = err.httpStatusCode;
    response.service =
        err.service || process.env.APP_NAME || process.env.SERVICE_NAME;
    return response;
};
exports.errorMessage = errorMessage;
module.exports = {
    InvalidTokenError, TokenExpiredError, AuthenticationError, AuthorizationError, EntryExistError, EntryNotFoundError, ValidationError, PaymentRequiredError, HTTP_STATUS_CODE_ERROR: exports.HTTP_STATUS_CODE_ERROR
};
//# sourceMappingURL=index.js.map