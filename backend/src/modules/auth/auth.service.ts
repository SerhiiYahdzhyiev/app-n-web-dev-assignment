import jwt from "jsonwebtoken";

import { SECRET, TOKEN_EXPIRES } from "../../config/auth";

import { Unauthorized } from "../../common/exceptions";

import { usersService } from "../users/users.service";

interface IAuthService {
  login: (email: string, password: string) => Promise<string>;
}

class AuthService implements IAuthService {
  public async login(email: string, password: string): Promise<string> {
    const user = await usersService.findOneByEmail(email);

    const unauthorizedMessage = "Invalid email or password!";

    if (!user || !(await user.isValidPassword(password))) {
      throw new Unauthorized(unauthorizedMessage);
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET, {
      expiresIn: TOKEN_EXPIRES,
    });

    return token;
  }
}

export const authService = new AuthService();
