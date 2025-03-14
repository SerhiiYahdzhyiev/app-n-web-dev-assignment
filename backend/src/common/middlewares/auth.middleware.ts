import { NextFunction, Request, Response } from "express";
import passport from "passport";

import { IUser } from "../../modules/users/users.model";

import { Unauthorized } from "../exceptions";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const middleware = passport.authenticate(
    "jwt",
    { session: false },
    (error: Error | null, user: IUser) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return next(new Unauthorized("You shall not pass!"));
      } else {
        req.user = user;
        next();
      }
    },
  );

  middleware(req, res, next);
};
