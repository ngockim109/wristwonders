import dotenv from "dotenv";
dotenv.config();
const MONGO_DB_URI =
  process.env.MONGO_DB_URI || "mongodb://localhost:27017/WristWonders";
const PORT = process.env.PORT || 3001;
const SECRET_KEY_FOR_ACCESS_TOKEN =
  process.env.SECRET_KEY_FOR_ACCESS_TOKEN || "secret";
const SECRET_KEY_FOR_REFRESH_TOKEN =
  process.env.SECRET_KEY_FOR_REFRESH_TOKEN || "secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const config = {
  mongo_uri: MONGO_DB_URI,
  port: PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN: SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN: SECRET_KEY_FOR_REFRESH_TOKEN,
  GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID
};
