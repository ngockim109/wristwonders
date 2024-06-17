import { GlobalError } from "./globalError";
import { ErrorTypeEnum } from "../utils/enums";

export class BadRequestError extends GlobalError {
  constructor(message: string, data?: object) {
    super(400, ErrorTypeEnum.BAD_REQUEST, message, data || {});
  }
}
