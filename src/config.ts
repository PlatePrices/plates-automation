import dotenv from 'dotenv';
import env from 'env-var';
import { Sequelize } from 'sequelize';

dotenv.config();

export const SOCKET_SERVER_URL = env
  .get('SOCKET_SERVER_URL')
  .required()
  .asString();

const DB_CONNECTION_URL = env.get('DB_CONNECTION_URL').required().asString();

export const sequalize = new Sequelize(DB_CONNECTION_URL, {
  dialect: 'mysql',
  logging: false,
});
