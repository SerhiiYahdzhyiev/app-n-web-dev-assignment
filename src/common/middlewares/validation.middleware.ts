import { ZodError, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

import { BadRequest, BaseHttpError } from "../exceptions";

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

export function validateUserId(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.userId;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequest(`Not valid userId value! Value: ${userId}`);
    }

    next();
  } catch (error) {
    next(error);
  }
}
