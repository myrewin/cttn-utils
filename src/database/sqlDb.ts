import { QueryTypes, Sequelize } from "sequelize";

export const SQL_initDb = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export const SQL_SELECT_QUERY_TYPE = { type: QueryTypes.SELECT };
export const SQL_INSERT_QUERY_TYPE = { type: QueryTypes.INSERT };
export const SQL_UPDATE_QUERY_TYPE = { type: QueryTypes.UPDATE };
export const SQL_DELETE_QUERY_TYPE = { type: QueryTypes.DELETE };

export { DataTypes, Op } from "sequelize";
