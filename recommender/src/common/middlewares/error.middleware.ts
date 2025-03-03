import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import { Logger } from "winston"

import { BadRequest, IBaseHttpError } from "../exceptions"


export const handleError = (logger: Logger) => {
  return (error: IBaseHttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(error.message, {label: "error.middleware"});
    res.statusCode = error.statusCode;

    res.json({
      message: error.message,
      errors: error.statusCode === StatusCodes.BAD_REQUEST
        ? (error as BadRequest).errors
        : undefined
    });
  }
}
