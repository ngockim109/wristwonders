import { ErrorRequestHandler } from "express";
import { GlobalError } from "../errors/globalError";
import { ValidationError } from "../errors/validationError";
import { Unauthenticated } from "../errors/unauthenticatedEror";
import { Unauthorized } from "../errors/unauthorizedError";
import { BadRequestError } from "../errors/badRequestError";
import { NotFoundError } from "../errors/notFoundError";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof GlobalError) {
    // Handle validation errors
    if (error instanceof ValidationError) {
      // get auth/login from url, remove website name
      const originalUrl = req.url.split("/").slice(2).join("/");
      const lastString = req.url.substring(req.url.lastIndexOf("/") + 1);
      const title = lastString.charAt(0).toUpperCase() + lastString.slice(1);
      console.log(title);
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      // console.log(data);
      console.log(error.errors);
      return res.render(originalUrl, {
        title: title,
        member: res.locals.member,
        error: error.errors,
        ...data
      });
    }

    // Handle Unauthenticated errors, redirect login
    if (error instanceof Unauthenticated) {
      return res.redirect("/wristwonders/auth/login");
    }

    // Handle Unauthorized errors, forbidden
    if (error instanceof Unauthorized) {
      // return res.redirect("/wristwonders/error/403");
      return res.redirect("/wristwonders/error/404");
    }

    // Handle bad request errors
    if (error instanceof BadRequestError) {
      // get auth/login from url, remove website name
      const originalUrl = req.url.split("/").slice(2).join("/");
      const lastString = req.url.substring(req.url.lastIndexOf("/") + 1);
      const title = lastString.charAt(0).toUpperCase() + lastString.slice(1);
      const data =
        error.data && typeof error.data === "object" ? error.data : {};

      // console.log(data);
      console.log("message", error.message);
      console.log("error", error);
      return res.render(originalUrl, {
        title: title,
        member: res.locals.member,
        error: error.message,
        ...data
      });
    }

    // Handle not found errors
    if (error instanceof NotFoundError) {
      return res.redirect("/wristwonders/error/404");
    }
  }

  // Handle server errors
  console.log(`Path: ${req.path}`, error);
  return res.redirect("/wristwonders/error/500");
};
export default errorHandler;
