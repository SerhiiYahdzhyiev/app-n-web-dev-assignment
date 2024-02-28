import { Router } from "express";

import { UsersController } from "./users.controller";
import {
  validateSchema,
  validateUserId,
} from "../../common/middlewares/validation.middleware";

import {
  UserUpdatePayloadValidationSchema,
  UserValidationSchema,
} from "./users.dto";

class UsersRouter {
  public router: Router;
  public usersController: UsersController = new UsersController();

  constructor() {
    this.router = Router();
    this.route();
  }

  public route(): void {
    this.router.post(
      "/create",
      validateSchema(UserValidationSchema),
      this.usersController.create,
    );

    this.router.get("/", this.usersController.getAll);

    this.router.get(
      "/:userId",
      validateUserId,
      this.usersController.getOneById,
    );

    this.router.put(
      "/:userId",
      validateUserId,
      validateSchema(UserUpdatePayloadValidationSchema),
      this.usersController.updateOneById,
    );

    this.router.delete(
      "/:userId",
      validateUserId,
      this.usersController.removeOneById,
    );
  }
}

export default new UsersRouter().router;
