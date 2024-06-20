import { ErrorRequestHandler } from "express";
import { GlobalError } from "../errors/globalError";
import { ValidationError } from "../errors/validationError";
import { Unauthenticated } from "../errors/unauthenticatedError";
import { Unauthorized } from "../errors/unauthorizedError";
import { BadRequestError } from "../errors/badRequestError";
import { NotFoundError } from "../errors/notFoundError";
import { IMember } from "../interfaces/member.interface";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const transformToTitleCase = (text: string) => {
    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const transformToSnakeCase = (text: string) => {
    return text.replace(/-/g, "_");
  };

  const getTitleFromUrl = (url: string) => {
    const lastSegment = url.substring(url.lastIndexOf("/") + 1);
    return transformToTitleCase(lastSegment);
  };

  const getOriginalUrl = (url: string) => {
    const urlSegments = url.split("/");
    // Remove the base part (e.g., "wristwonders")
    const baseRemoved = urlSegments.slice(2).join("/");
    const lastSegment = baseRemoved.substring(baseRemoved.lastIndexOf("/") + 1);
    const basePath = baseRemoved.replace(`/${lastSegment}`, "");
    return `${basePath}/${transformToSnakeCase(lastSegment)}`;
  };
  // Transform the title and originalUrl based on req.url
  const title = getTitleFromUrl(req.url);
  const originalUrl = getOriginalUrl(req.url);
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
      console.error(error.errors);
      return res.render(originalUrl, {
        title: title,
        member: newMember,
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
      const data =
        error.data && typeof error.data === "object" ? error.data : {};
      console.error("error", error);

      return res.render(originalUrl, {
        title: title,
        member: newMember,
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
  console.error(`Path: ${req.path}`, error);
  return res.redirect("/wristwonders/error/500");
};
export default errorHandler;
