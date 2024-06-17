import { GlobalError } from "./globalError";
import { ErrorTypeEnum } from "../utils/enums";

export class NotFoundError extends GlobalError {
  constructor() {
    super(404, ErrorTypeEnum.NOT_FOUND, "Page not found", {});
  }
}
