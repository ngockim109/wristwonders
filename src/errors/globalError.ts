import { ErrorTypeEnum } from "../utils/enums";

export class GlobalError extends Error {
  public statusCode: number;
  public type: ErrorTypeEnum;
  public message: string;
  public data: unknown;
  constructor(
    statusCode: number,
    type: ErrorTypeEnum,
    message: string,
    data: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
