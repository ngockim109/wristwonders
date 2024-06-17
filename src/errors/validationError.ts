import { GlobalError } from "./globalError";
import { ErrorTypeEnum } from "../utils/enums";

export class ValidationError extends GlobalError {
  public errors: object;

  constructor(errors: object, data?: object) {
    super(400, ErrorTypeEnum.VALIDATION, "Validation error", data || {});
    this.errors = errors;
  }
}
