import { SECRET } from "../../config/auth";

import { Request } from "express";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";

import { IUser } from "../../modules/users/users.model";
import { usersService } from "../../modules/users/users.service";

import { Unauthorized } from "../exceptions";

interface IStrategyOptions {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
}

const options: IStrategyOptions = {
  jwtFromRequest: extract,
  secretOrKey: SECRET,
};

export const strategy: Strategy = new Strategy(
  options,
  async (jwtPayload, done) => {
    try {
      const { exp: expiration } = jwtPayload;

      const user: IUser = await usersService.findOneById(jwtPayload.userId);

      if (isExpired(expiration)) {
        done(new Unauthorized("Expired token!"), false);
      }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error: any) {
      done(new Unauthorized(error.message));
    }
  },
);

function extract(req: Request): string | null {
  let token = null;

  if (req && req.signedCookies) {
    token = req.signedCookies["token"];
  }

  token = token && decodeURIComponent(token);

  return token;
}

function isExpired(expiresAtSeconds: number) {
  return Math.floor(Date.now() / 1000) > expiresAtSeconds;
}
