import { Router } from "express";

import { validateSchema } from "../../common/middlewares/validation.middleware";

import { AuthController } from "./auth.controller";
import { LoginDataSchema } from "./auth.dto";
import { auth } from "../../common/middlewares/auth.middleware";
import { UserUpdatePayloadValidationSchema } from "../users/users.dto";

class AuthRouter {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.route();
  }

  public route(): void {
    this.router.post(
      "/login",
      validateSchema(LoginDataSchema),
      this.authController.login,
    );
    this.router.post(
      "/register",
      validateSchema(UserUpdatePayloadValidationSchema),
      this.authController.register,
    );
    this.router.get(
      "/logout",
      auth,
      this.authController.logout,
    );
  }
}

export default new AuthRouter().router;
