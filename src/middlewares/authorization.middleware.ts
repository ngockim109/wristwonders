import { NextFunction, Request, Response } from "express";
import { Unauthenticated } from "../errors/unauthenticatedError";
import { Unauthorized } from "../errors/unauthorizedError";

// Middleware to ensure authorization
export const requireAuthor = (roles: boolean[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("requireAuthor middleware called");
    console.log("Roles required:", roles);
    console.log("Member in res.locals:", res.locals.member);
    const loggedInMember = res.locals.member;
    // Check if there is a logged-in user
    if (!loggedInMember) {
      next(new Unauthenticated());
    } else {
      if (!roles.includes(loggedInMember.isAdmin)) {
        next(new Unauthorized());
      }
    }
    next();
  };
};

// Middleware to ensure the user can only access their own profile
export const requireSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedInMember = res.locals.member;

  // Check if there is a logged-in user
  if (!loggedInMember) {
    return next(new Unauthenticated());
  }

  // Ensure that only the member can access their own profile
  const memberId = loggedInMember._id.toString();
  const requestedId = req.params.id ?? memberId;

  if (memberId !== requestedId) {
    return next(new Unauthenticated());
  }

  next();
};
