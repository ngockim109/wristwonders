import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/dotenv.config";
import Member from "../models/member.model";
import { Unauthenticated } from "../errors/unauthenticatedEror";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      config.SECRET_KEY_FOR_ACCESS_TOKEN,
      (error, decodedToken) => {
        if (error) {
          return next(new Unauthenticated());
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    return next(new Unauthenticated());
  }
};

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      config.SECRET_KEY_FOR_ACCESS_TOKEN,
      async (error, decodedToken) => {
        if (error) {
          console.log(error.message);
          res.locals.member = null;
          next();
        } else {
          console.log(decodedToken);
          const member = await Member.findById(decodedToken.member_id);
          res.locals.member = member;
          next();
        }
      }
    );
  } else {
    res.locals.member = null;
    next();
  }
};
