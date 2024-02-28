import { Router } from "express";

import { validateSchema } from "../../common/middlewares/validation.middleware";

import { AuthController } from "./auth.controller";
import { LoginDataSchema } from "./auth.dto";

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
  }
}

export default new AuthRouter().router;
