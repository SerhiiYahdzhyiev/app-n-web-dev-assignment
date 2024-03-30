import { StatusCodes } from "http-status-codes";

import { BaseHttpError } from "./base-http";


export class Forbidden extends BaseHttpError {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, message);
  }
}
