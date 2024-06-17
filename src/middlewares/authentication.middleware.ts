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
  const token = req.cookies.access_token;

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
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(
      token,
      config.SECRET_KEY_FOR_ACCESS_TOKEN,
      async (error, decodedToken) => {
        if (error) {
          console.log("JWT verification error:", error.message);
          res.locals.member = null;
          next();
        } else {
          console.log("Decoded Token:", decodedToken);
          try {
            const member = await Member.findById(decodedToken.member_id);
            if (member) {
              res.locals.member = member;
              console.log("Member set in res.locals:", res.locals.member);
            } else {
              res.locals.member = null;
              console.log("Member not found in database");
            }
            next();
          } catch (dbError) {
            console.error("Error fetching member from DB:", dbError);
            res.locals.member = null;
            next();
          }
        }
      }
    );
  } else {
    console.log("No token provided, res.locals.member set to null");
    res.locals.member = null;
    next();
  }
};
