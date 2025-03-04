import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { BadRequest, BaseHttpError } from "../../common/exceptions";

import { appConfig } from "../../config/app";

import { IUser } from "../users/users.model";
import { UserRoles } from "../users/users.dto";
import { productService } from "./products.service";
import { IProduct } from "./products.model";

import { logger } from "../../logger";

let label = "ProductsController";

export class ProductsController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can create new products!",
          });
        return;
      }

      const newProductId = await productService.create(req.body);

      logger.info("Created product with id " + newProductId, { label });

      res
        .status(StatusCodes.OK)
        .json({ id: newProductId });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.query;

      let elements: IProduct[];

      if (title) {
        elements = await productService.findManyByTitle(title as string);
      } else {
        elements = await productService.findAll();
      }

      logger.info("Returned products list.", { label });

      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          elements,
        });
    } catch (error) {
      next(error);
    }
  }

  public async getRecommended(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Realize....
      const response = await fetch(
        appConfig.recommenderUrl + "/" +(req.user as IUser)._id
      );

      const elements = await response.json();

      logger.info("Returning recommended list...", { label });

      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          elements: elements.slice(0,3),
        });
    } catch (error) {
      next(error);
    }
  }

  public async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const product = await productService.findOneById(productId);

      logger.info("Reutrned product with id " + product._id, { label });

      res
        .status(StatusCodes.OK)
        .json(product);
    } catch (error) {
      next(error);
    }
  }

  public async updateOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const updatePayload = req.body;

      if (!Object.keys(updatePayload).length) {
        throw new BadRequest("Nothing to update, got empty update payload!");
      }

      if (
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can update products!",
          });
        return;
      }

      const { productId } = req.params;

      const updatedId = await productService.updateOneById(
        productId,
        updatePayload,
      );

      if (String(updatedId) !== productId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while updating product with id: " + productId +
            " !",
        );
      }

      logger.info("Updated user with id " + updatedId, { label });

      res
        .status(StatusCodes.OK)
        .json({
          updatedId,
        });
    } catch (error) {
      next(error);
    }
  }

  public async removeOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId: string = req.params.productId;

      if (
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can remove products!",
          });
        return;
      }

      const removedId = await productService.removeOneById(
        productId,
      );

      console.log(removedId, productId);

      if (String(removedId) !== productId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while deleting user with id: " + productId +
            " !",
        );
      }

      logger.info("Deleted product with id " + removedId, { label });

      res
        .status(StatusCodes.OK)
        .json({
          removedId,
        });
    } catch (error) {
      next(error);
    }
  }
}
