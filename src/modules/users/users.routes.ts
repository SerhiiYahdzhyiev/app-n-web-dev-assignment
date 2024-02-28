import { Router } from "express";

import { UsersController } from "./users.controller";
import {
  validateSchema,
  validateUserId,
} from "../../common/middlewares/validation.middleware";
import { auth } from "../../common/middlewares/auth.middleware";

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

    this.router.get("/", auth, this.usersController.getAll);

    this.router.get(
      "/:userId",
      auth,
      validateUserId,
      this.usersController.getOneById,
    );

    this.router.put(
      "/:userId",
      auth,
      validateUserId,
      validateSchema(UserUpdatePayloadValidationSchema),
      this.usersController.updateOneById,
    );

    this.router.delete(
      "/:userId",
      auth,
      validateUserId,
      this.usersController.removeOneById,
    );
  }
}

export default new UsersRouter().router;
