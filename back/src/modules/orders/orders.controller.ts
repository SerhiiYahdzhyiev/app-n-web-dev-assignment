import { NextFunction, Request, Response } from "express";

import { productService } from "../products/products.service";

import { TOrderCreationPayload, TOrderUpdatePayload } from "./orders.dto";
import { usersService } from "../users/users.service";
import { ordersService } from "./orders.service";
import { StatusCodes } from "http-status-codes";
import { BadRequest, BaseHttpError } from "../../common/exceptions";

import { logger } from "../../logger";
import { IUser } from "../users/users.model";
import { UserRoles } from "../users/users.dto";

let label = "OrdersController";

export class OrdersController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: TOrderCreationPayload = req.body;

      let totalPrice: number;
      if (!payload.totalPrice) {
        totalPrice = await productService.getTotalPriceForMany(
          payload.productsIds,
        );
      } else {
        totalPrice = payload.totalPrice;
      }

      await usersService.findOneById(payload.userId);

      const newOrderId = await ordersService.create({
        ...payload,
        totalPrice,
      });

      logger.info("Created order with id " + newOrderId, { label });

      res.status(StatusCodes.OK).json({
        id: newOrderId,
      });
    } catch (error) {
      next(error);
    }
  }
  public async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const orders = await ordersService.getAll();

      logger.info("Returned orders.", { label });

      res.status(StatusCodes.OK).json({
        elements: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      const order = await ordersService.findOneById(orderId);

      logger.info("Returned order with id " + order._id, { label });

      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      next(error);
    }
  }

  public async updateOneById(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can update orders!",
          });
        return;
      }

      const orderId = req.params.orderId;
      const payload: TOrderUpdatePayload = req.body;

      if (!Object.keys(payload).length) {
        throw new BadRequest("Nothing to update, got empty update payload!");
      }

      const updatedId = await ordersService.updateOneById(orderId, payload);

      if (String(updatedId) !== orderId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while updating order with id: " + orderId +
          " !",
        );
      }

      logger.info(`Updated Order with id: ${updatedId}.`, { label });

      res.status(StatusCodes.OK).json({ updatedId });
    } catch (error) {
      next(error);
    }
  }

  public async removeOneById(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can delete orders!",
          });
        return;
      }

      const orderId = req.params.orderId;
      const removedId = await ordersService.removeOneById(orderId);

      if (String(removedId) !== orderId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while removing order with id: " + orderId +
          " !",
        );
      }

      logger.info(`Removed Order with id: ${removedId}.`, { label });

      res.status(StatusCodes.OK).json({ removedId });
    } catch (error) {
      next(error);
    }
  }
}
