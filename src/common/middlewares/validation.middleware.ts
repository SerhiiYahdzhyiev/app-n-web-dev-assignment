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

export function validateUserId(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      throw new BadRequest(`Not valid userId value! Value: ${userId}`);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateProductId(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      throw new BadRequest(`Not valid productId value! Value: ${productId}`);
    }

    next();
  } catch (error) {
    next(error);
  }
}
