import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

export const MONGODB_CONNECTION_URL = env.get('MONGO_DB_URL_CONNECTION').required().asString();
export const BETTER_STACK_LOG_API_KEY = env.get('BETTER_STACK_LOG_API_KEY').required().asString();
