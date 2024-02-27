import { NextFunction, Request, Response } from "express";

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Realize...
    } catch (error) {
      next(error);
    }
  }
}
