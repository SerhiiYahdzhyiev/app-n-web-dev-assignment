import { Request, Router } from "express";

import { UsersController } from "./users.controller";
import {
  getObjectIdValidationMiddleware,
  validateSchema,
} from "../../common/middlewares/validation.middleware";

import {
  UserUpdatePayloadValidationSchema,
  UserValidationSchema,
} from "./users.dto";

class UsersRouter {
  public router: Router;
  public usersController: UsersController = new UsersController();

  private userIdExtractor(req: Request) {
    return req.params.userId;
  }

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
      getObjectIdValidationMiddleware(this.userIdExtractor),
      this.usersController.getOneById,
    );

    this.router.put(
      "/:userId",
      getObjectIdValidationMiddleware(this.userIdExtractor),
      validateSchema(UserUpdatePayloadValidationSchema),
      this.usersController.updateOneById,
    );

    this.router.delete(
      "/:userId",
      getObjectIdValidationMiddleware(this.userIdExtractor),
      this.usersController.removeOneById,
    );
  }
}

export default new UsersRouter().router;
