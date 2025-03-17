import { StatusCodes } from "http-status-codes";

export interface IBaseHttpError {
  statusCode: StatusCodes;
  message: string;
}

export class BaseHttpError implements IBaseHttpError {
  public statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  public message: string = "Oops! Something went wrong!";

  constructor(statusCode?: StatusCodes, message?: string) {
    if (statusCode) this.statusCode = statusCode;
    if (message) this.message = message;
  }
}
