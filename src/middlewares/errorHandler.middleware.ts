import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { GlobalError } from "../errors/globalError";
import { ValidationError } from "../errors/validationError";
import { Unauthenticated } from "../errors/unauthenticatedError";
import { Unauthorized } from "../errors/unauthorizedError";
import { BadRequestError } from "../errors/badRequestError";
import { NotFoundError } from "../errors/notFoundError";
import { IMember } from "../interfaces/member.interface";

const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let newMember: IMember;

  if (res.locals.member) {
    const member = res.locals.member;
    const {
      membername,
      YOB,
      name,
      _id,
      password,
      isAdmin,
      createdAt,
      updatedAt,
      __v
    } = member;
    newMember = {
      membername,
      YOB,
      name,
      _id,
      password,
      isAdmin,
      createdAt,
      updatedAt,
      __v
    };
  }

  if (error instanceof GlobalError) {
    // Handle validation errors
    if (error instanceof ValidationError) {
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      return res.status(400).json({
        error: error.errors,
        member: newMember,
        ...data
      });
    }

    // Handle Unauthenticated errors, redirect login
    if (error instanceof Unauthenticated) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    // Handle Unauthorized errors, forbidden
    if (error instanceof Unauthorized) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Handle bad request errors
    if (error instanceof BadRequestError) {
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      return res.status(400).json({
        error: error.message,
        member: newMember,
        ...data
      });
    }

    // Handle not found errors
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: "Not Found" });
    }
  }

  // Handle server errors
  console.error(`Path: ${req.path}`, error);
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
