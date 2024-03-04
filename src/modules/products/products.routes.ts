import { Router } from "express";

import {
  validateProductId,
  validateSchema,
} from "../../common/middlewares/validation.middleware";

import { ProductsController } from "./products.controller";
import { ProductSchema, ProductUpdatePayloadSchema } from "./products.dto";

class UsersRouter {
  public router: Router;
  public productsController: ProductsController = new ProductsController();

  constructor() {
    this.router = Router();
    this.route();
  }

  public route(): void {
    this.router.post(
      "/create",
      validateSchema(ProductSchema),
      this.productsController.create,
    );

    this.router.get("/", this.productsController.getAll);

    this.router.get(
      "/:productId",
      validateProductId,
      this.productsController.getOneById,
    );

    this.router.put(
      "/:productId",
      validateProductId,
      validateSchema(ProductUpdatePayloadSchema),
      this.productsController.updateOneById,
    );

    this.router.delete(
      "/:productId",
      validateProductId,
      this.productsController.removeOneById,
    );
  }
}

export default new UsersRouter().router;
