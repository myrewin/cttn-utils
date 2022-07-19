"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.SQL_DELETE_QUERY_TYPE = exports.SQL_UPDATE_QUERY_TYPE = exports.SQL_INSERT_QUERY_TYPE = exports.SQL_SELECT_QUERY_TYPE = exports.initDB = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
exports.initDB = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});
exports.SQL_SELECT_QUERY_TYPE = { type: sequelize_1.QueryTypes.SELECT };
exports.SQL_INSERT_QUERY_TYPE = { type: sequelize_1.QueryTypes.INSERT };
exports.SQL_UPDATE_QUERY_TYPE = { type: sequelize_1.QueryTypes.UPDATE };
exports.SQL_DELETE_QUERY_TYPE = { type: sequelize_1.QueryTypes.DELETE };
exports.uuid = {
    toBinary: (uuid) => {
        if (!uuid)
            uuid = (0, uuid_1.v1)();
        else if (typeof uuid !== "string" && Buffer.isBuffer(uuid))
            return uuid;
        const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
        return Buffer.concat([
            buf.subarray(6, 8),
            buf.subarray(4, 6),
            buf.subarray(0, 4),
            buf.subarray(8, 16),
        ]);
    },
    toString: (binary) => {
        if (!binary)
            throw new Error("Kindly supply binary UUID value");
        if (typeof binary === "string")
            return binary;
        return [
            binary.toString("hex", 4, 8),
            binary.toString("hex", 2, 4),
            binary.toString("hex", 0, 2),
            binary.toString("hex", 8, 10),
            binary.toString("hex", 10, 16),
        ].join("-");
    },
    mysqlBinary: (value) => sequelize_1.Sequelize.fn("UUID_TO_BIN", value, 1),
    mysqlUUID: (field) => [
        sequelize_1.Sequelize.fn("BIN_TO_UUID", sequelize_1.Sequelize.col(field), 1),
        field,
    ],
    get: () => (0, uuid_1.v1)(),
    isValid: (uuid) => (0, uuid_1.validate)(uuid),
};
//# sourceMappingURL=sqlDb.js.map