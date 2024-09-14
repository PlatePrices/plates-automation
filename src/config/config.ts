import dotenv from "dotenv";
import env from "env-var";
import { Sequelize } from "sequelize";

dotenv.config();

export const DB_CONNECTION_URL = env
  .get("DB_URL_CONNECTION")
  .required()
  .asString();
export const BETTER_STACK_LOG_API_KEY = env
  .get("BETTER_STACK_LOG_API_KEY")
  .required()
  .asString();
export const REDIS_URL_CONNECTION = env
  .get("REDIS_URL_CONNECTION")
  .required()
  .asString();

export const sequalize = new Sequelize(DB_CONNECTION_URL, {
  dialect: "mysql",
  logging: false,
});
