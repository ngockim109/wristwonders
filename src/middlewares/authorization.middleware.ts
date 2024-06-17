import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../errors/unauthorizedError";

export const requireAuthor = (roles: boolean[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("requireAuthor middleware called");
    console.log("Roles required:", roles);
    console.log("Member in res.locals:", res.locals.member);
    if (!res.locals.member) {
      next(new Unauthorized());
    } else {
      if (!roles.includes(res.locals.member.isAdmin)) {
        next(new Unauthorized());
      }
    }
    next();
  };
};
