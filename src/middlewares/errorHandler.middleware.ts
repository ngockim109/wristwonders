import { ErrorRequestHandler } from "express";
import { GlobalError } from "../errors/globalError";
import { ValidationError } from "../errors/validationError";
import { Unauthenticated } from "../errors/unauthenticatedEror";
import { Unauthorized } from "../errors/unauthorizedError";
import { BadRequestError } from "../errors/badRequestError";
import { NotFoundError } from "../errors/notFoundError";
import { ErrorTypeEnum } from "../utils/enums";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof GlobalError) {
    if (error instanceof ValidationError) {
      console.log(req.url);
      const originalUrl = req.url;
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      return res.render(originalUrl, {
        error: error.errors,
        ...data
      });
    }
    if (error instanceof Unauthenticated) {
      return res.redirect("/wristwonders/login");
    }
    if (error instanceof Unauthorized) {
      return res.redirect("/wristwonders/error/403");
    }
    if (error instanceof BadRequestError) {
      const originalUrl = req.url;
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      return res.render(originalUrl, {
        error: error.message,
        ...data
      });
    }
    if (error instanceof NotFoundError) {
      return res.redirect("/wristwonders/error/404");
    }
  }
  console.log(`Path: ${req.path}`, error);
  return res.status(500).send(ErrorTypeEnum.SERVER_ERROR);
};
export default errorHandler;
