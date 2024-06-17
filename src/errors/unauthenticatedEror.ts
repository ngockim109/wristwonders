import { GlobalError } from "./globalError";
import { ErrorTypeEnum } from "../utils/enums";

export class Unauthenticated extends GlobalError {
  constructor() {
    super(401, ErrorTypeEnum.UNAUTHENTICATED, "Unauthorized", {});
  }
}
