import { Request, Router } from "express";

import {
  getObjectIdValidationMiddleware,
  validateSchema,
} from "../../common/middlewares/validation.middleware";

import { orderCreationSchema, orderUpdationSchema } from "./orders.dto";
import { OrdersController } from "./orders.controller";

class OrdersRouter {
  public router: Router;
  public ordersController: OrdersController = new OrdersController();

  private orderIdExtractor(req: Request) {
    return req.params.orderId;
  }

  constructor() {
    this.router = Router();
    this.route();
  }

  public route(): void {
    this.router.post(
      "/create",
      validateSchema(orderCreationSchema),
      this.ordersController.create,
    );

    this.router.get("/", this.ordersController.getAll);

    this.router.get(
      "/:orderId",
      getObjectIdValidationMiddleware(this.orderIdExtractor),
      this.ordersController.getOneById,
    );

    this.router.put(
      "/:orderId",
      getObjectIdValidationMiddleware(this.orderIdExtractor),
      validateSchema(orderUpdationSchema),
      this.ordersController.updateOneById,
    );

    this.router.delete(
      "/:orderId",
      getObjectIdValidationMiddleware(this.orderIdExtractor),
      this.ordersController.removeOneById,
    );
  }
}

export default new OrdersRouter().router;
