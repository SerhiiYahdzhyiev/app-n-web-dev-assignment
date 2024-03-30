import { StatusCodes } from "http-status-codes";

import { BaseHttpError } from "./base-http";


export class BadRequest extends BaseHttpError {
  public errors?: Record<string, string>;

  constructor(message: string, errors?: Record<string, string>) {
    super(StatusCodes.BAD_REQUEST, message);

    if (errors) this.errors = errors;
  }
}
