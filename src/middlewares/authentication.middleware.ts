import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/dotenv.config";
import Member from "../models/member.model";
import { Unauthenticated } from "../errors/unauthenticatedError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(
      token,
      config.SECRET_KEY_FOR_ACCESS_TOKEN,
      (error, _decodedToken) => {
        if (error) {
          return next(new Unauthenticated());
        } else {
          next();
        }
      }
    );
  } else {
    return next(new Unauthenticated());
  }
};

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(
      token,
      config.SECRET_KEY_FOR_ACCESS_TOKEN,
      async (error, decodedToken) => {
        if (error) {
          res.locals.member = null;
          next();
        } else {
          try {
            const member = await Member.findById(decodedToken.member_id);
            if (member) {
              res.locals.member = member;
            } else {
              res.locals.member = null;
            }
            next();
          } catch (dbError) {
            res.locals.member = null;
            next();
          }
        }
      }
    );
  } else {
    res.locals.member = null;
    next();
  }
};
