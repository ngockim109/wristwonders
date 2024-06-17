import bcrypt from "bcrypt";
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { config } from "../config/dotenv.config";

const { SECRET_KEY_FOR_ACCESS_TOKEN, SECRET_KEY_FOR_REFRESH_TOKEN } = config;
export const ACCESS_TOKEN_EXPIRATION = 3 * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_EXP = "30d";

// Hash password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare hash password
export const compareHashPassword = async (
  password: string,
  memberPassword: string
) => {
  return bcrypt.compare(password, memberPassword);
};

// sign jwt
export const createAccessToken = (
  payload: any,
  option?: SignOptions & { secret?: string }
) => {
  const { secret = SECRET_KEY_FOR_ACCESS_TOKEN, ...opts } = option || {};
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
    ...opts
  });
};

// verify jwt
