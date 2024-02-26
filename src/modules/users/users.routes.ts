import { Router } from "express";

import { UsersController } from "./users.controller";
import { validateSchema } from "../../common/middlewares/validation.middleware";
import { UserValidationSchema } from "./users.dto";


class UsersRouter {
  public router: Router;
  public usersController: UsersController = new UsersController();

  constructor() {
    this.router = Router();
    this.route();
  }

  public route(): void {
    this.router.get("/", this.usersController.getAll);
    this.router.get("/:userId", this.usersController.getOneById);
    this.router.post("/create", validateSchema(UserValidationSchema), this.usersController.create);
  }
}

export default new UsersRouter().router;
