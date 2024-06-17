import { GlobalError } from "./globalError";
import { ErrorTypeEnum } from "../utils/enums";

export class Unauthorized extends GlobalError {
  constructor() {
    super(403, ErrorTypeEnum.UNAUTHORIZED, "Forbidden", {});
  }
}
