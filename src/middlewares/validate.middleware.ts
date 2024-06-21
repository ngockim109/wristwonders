import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors/validationError";

const validate =
  (schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      return next();
    } catch (err) {
      const error_message = JSON.parse(err.message);
      const errorMap: object = {};
      error_message.forEach(
        (error) => (errorMap[error.path[1]] = error.message)
      );
      next(new ValidationError(errorMap, req.body));
    }
  };

export default validate;
