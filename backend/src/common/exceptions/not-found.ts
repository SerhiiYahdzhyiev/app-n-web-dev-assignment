import { StatusCodes } from "http-status-codes";

import { BaseHttpError } from "./base-http";


export class NotFound extends BaseHttpError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
