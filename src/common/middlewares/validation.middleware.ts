import { ZodError, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

import { BadRequest, BaseHttpError } from "../exceptions";
import { isValidObjectId } from "mongoose";

export function validateSchema(schema: ZodSchema) {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          formattedErrors[path] = err.message;
        });
        next(new BadRequest("Validation error", formattedErrors));
      } else {
        next(new BaseHttpError());
      }
    }
  };
}

export function getObjectIdValidationMiddleware(
  requestUnpacker: (req: Request) => string | null,
) {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const id = requestUnpacker(req);

      if (!isValidObjectId(id)) {
        throw new BadRequest(`Not valid userId value! Value: ${id}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
