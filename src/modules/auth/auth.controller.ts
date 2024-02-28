import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login: email, password } = req.body;

      const token = await authService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: true,
      });

      res
        .status(StatusCodes.NO_CONTENT)
        .end();
    } catch (error) {
      next(error);
    }
  }
}
