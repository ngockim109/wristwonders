import dotenv from "dotenv";
dotenv.config();
const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;
const SECRET_KEY_FOR_ACCESS_TOKEN = process.env.SECRET_KEY_FOR_ACCESS_TOKEN;
const SECRET_KEY_FOR_REFRESH_TOKEN = process.env.SECRET_KEY_FOR_REFRESH_TOKEN;
export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN: SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN: SECRET_KEY_FOR_REFRESH_TOKEN
};
