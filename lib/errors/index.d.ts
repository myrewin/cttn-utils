export declare class ValidationError extends Error {
    httpStatusCode: number;
    constructor(message: string);
}
export declare class EntryExistError extends Error {
    httpStatusCode: number;
    constructor(message: string);
}
export declare class EntryNotFoundError extends Error {
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
export declare const customErrorMessage: ({ err, ERROR_TYPE, }: {
    err: any;
    ERROR_TYPE: string;
}) => any;
export declare const errorMessage: ({ err, ERROR_TYPE, }: {
    err: any;
    ERROR_TYPE: string;
}) => any;
//# sourceMappingURL=index.d.ts.map