import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { authService } from "./auth.service";
import { usersService } from "../users/users.service";
import { UserRoles } from "../users/users.dto";
import { BadRequest } from "../../common/exceptions";

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;

      if (
        "role" in payload
        && payload.role === UserRoles.ADMIN
      ) {
        throw new BadRequest("Admin user registration is not allowed!");
      }

      const newUserId = await usersService.create(payload);

      res
        .status(StatusCodes.OK)
        .json({ id: newUserId });
    } catch (error) {
      next(error);
    }
  }
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
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("token", "", {
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
