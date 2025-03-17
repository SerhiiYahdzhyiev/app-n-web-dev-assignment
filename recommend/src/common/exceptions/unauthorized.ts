import { StatusCodes } from "http-status-codes";

import { BaseHttpError } from "./base-http";


export class Unauthorized extends BaseHttpError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}
