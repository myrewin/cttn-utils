"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQL_DataTypes = exports.SQL_DELETE_QUERY_TYPE = exports.SQL_UPDATE_QUERY_TYPE = exports.SQL_INSERT_QUERY_TYPE = exports.SQL_SELECT_QUERY_TYPE = exports.SQL_initDb = void 0;
const sequelize_1 = require("sequelize");
exports.SQL_initDb = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});
exports.SQL_SELECT_QUERY_TYPE = { type: sequelize_1.QueryTypes.SELECT };
exports.SQL_INSERT_QUERY_TYPE = { type: sequelize_1.QueryTypes.INSERT };
exports.SQL_UPDATE_QUERY_TYPE = { type: sequelize_1.QueryTypes.UPDATE };
exports.SQL_DELETE_QUERY_TYPE = { type: sequelize_1.QueryTypes.DELETE };
exports.SQL_DataTypes = sequelize_1.DataTypes;
//# sourceMappingURL=sqlDb.js.map