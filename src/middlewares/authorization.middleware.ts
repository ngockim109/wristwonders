import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../errors/unauthorizedError";
import { RoleEnum } from "../utils/enums";

export const requireAuthor = (roles: RoleEnum[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.member) {
      next(new Unauthorized());
    }
    if (!roles.includes(res.locals.member.isAdmin)) {
      next(new Unauthorized());
    }
    next();
  };
};
