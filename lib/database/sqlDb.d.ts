/// <reference types="node" />
import { QueryTypes, Sequelize } from "sequelize";
export declare const initDB: Sequelize;
export declare const SQL_SELECT_QUERY_TYPE: {
    type: QueryTypes;
};
export declare const SQL_INSERT_QUERY_TYPE: {
    type: QueryTypes;
};
export declare const SQL_UPDATE_QUERY_TYPE: {
    type: QueryTypes;
};
export declare const SQL_DELETE_QUERY_TYPE: {
    type: QueryTypes;
};
export declare const uuid: {
    toBinary: (uuid: string) => Buffer;
    toString: (binary: any) => string;
    mysqlBinary: (value: any) => import("sequelize/types/utils").Fn;
    mysqlUUID: (field: any) => any[];
    get: () => string;
    isValid: (uuid: any) => boolean;
};
//# sourceMappingURL=sqlDb.d.ts.map