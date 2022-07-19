import { QueryTypes, Sequelize, DataTypes} from "sequelize";

import { v1 as uuidV1, validate as UUIDValidaton } from "uuid";

export const initDB = new Sequelize(
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

export const uuid = {
  toBinary: (uuid: string) => {
    if (!uuid) uuid = uuidV1();
    else if (typeof uuid !== "string" && Buffer.isBuffer(uuid)) return uuid;
    const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
    return Buffer.concat([
      buf.subarray(6, 8),
      buf.subarray(4, 6),
      buf.subarray(0, 4),
      buf.subarray(8, 16),
    ]);
  },
  toString: (binary: any) => {
    if (!binary) throw new Error("Kindly supply binary UUID value");
    if (typeof binary === "string") return binary;
    return [
      binary.toString("hex", 4, 8),
      binary.toString("hex", 2, 4),
      binary.toString("hex", 0, 2),
      binary.toString("hex", 8, 10),
      binary.toString("hex", 10, 16),
    ].join("-");
  },
  mysqlBinary: (value: any) => Sequelize.fn("UUID_TO_BIN", value, 1),
  mysqlUUID: (field: any) => [
    Sequelize.fn("BIN_TO_UUID", Sequelize.col(field), 1),
    field,
  ],
  get: () => uuidV1(),
  isValid: (uuid: any) => UUIDValidaton(uuid),
};


