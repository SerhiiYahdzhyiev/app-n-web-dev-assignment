import { Request, Router } from "express";

import {
  getObjectIdValidationMiddleware,
  validateSchema,
} from "../../common/middlewares/validation.middleware";

import { ProductsController } from "./products.controller";
import { ProductSchema, ProductUpdatePayloadSchema } from "./products.dto";

class UsersRouter {
  public router: Router;
  public productsController: ProductsController = new ProductsController();

  private productIdExtractor(req: Request) {
    return req.params.productId;
  }

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
      getObjectIdValidationMiddleware(this.productIdExtractor),
      this.productsController.getOneById,
    );

    this.router.put(
      "/:productId",
      getObjectIdValidationMiddleware(this.productIdExtractor),
      validateSchema(ProductUpdatePayloadSchema),
      this.productsController.updateOneById,
    );

    this.router.delete(
      "/:productId",
      getObjectIdValidationMiddleware(this.productIdExtractor),
      this.productsController.removeOneById,
    );
  }
}

export default new UsersRouter().router;
