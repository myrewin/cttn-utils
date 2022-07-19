export declare const shuffelWord: (word: any) => string;
export declare const deleteFile: (file: any) => Promise<boolean>;
export declare function joiValidator(constraint: any, isMiddleware?: boolean): any;
export declare const uploadFile: ({ name, limit, allowedFormat, location, }: {
    name?: string | undefined;
    limit?: number | undefined;
    allowedFormat?: any[] | undefined;
    location?: string | undefined;
}) => any;
export declare const slugify: ({ value, lowerCase, }: {
    value: string;
    lowerCase: boolean;
}) => string;
export declare const getContent: ({ url, method, headers, token, data, }: {
    url: string;
    method?: "GET" | "DELETE" | undefined;
    headers?: Record<string, any> | undefined;
    token?: string | undefined;
    data?: Record<string, any> | undefined;
}) => Promise<any>;
export declare const postContent: ({ url, token, data, method, headers, }: {
    url: string;
    token?: string | undefined;
    data?: Record<string, any> | undefined;
    method?: "POST" | "PATCH" | undefined;
    headers?: Record<string, any> | undefined;
}) => Promise<any>;
export declare const paginate: (totalCount: number, currentPage: number, perPage: number) => object;
export declare const decodeJwt: (cipher: any, secreteKey: string) => Promise<unknown>;
export declare const encodeJwt: ({ data, secreteKey, duration, }: {
    data: any;
    secreteKey: string;
    duration: string;
}) => Promise<unknown>;
export declare function globalErrorHandler(err: Error): void;
export declare function devLog(...keys: any): void;
export declare function parseJSON(value: any): any;
//# sourceMappingURL=index.d.ts.map