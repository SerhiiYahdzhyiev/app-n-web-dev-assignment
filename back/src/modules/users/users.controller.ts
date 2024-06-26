import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { usersService } from "./users.service";
import { IUser } from "./users.model";

import { logger } from "../../logger";
import {
  BadRequest,
  BaseHttpError,
  Unauthorized,
} from "../../common/exceptions";
import { UserRoles } from "./users.dto";

let label = "UsersController";

export class UsersController {
  public async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user! as IUser)._id;

      if (!userId) {
        throw new Unauthorized("Unauthorized!");
      }

      const userData = await usersService.findOneById(userId);

      res
        .status(StatusCodes.OK)
        .json(mapUserRecordToResponsePayload(userData));
    } catch (error) {
      next(error);
    }
  }
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        req.body.role === UserRoles.ADMIN &&
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can create new admin user!",
          });
        return;
      }

      const newUserId = await usersService.create(req.body);

      logger.info("Created user with id " + newUserId, { label });

      res
        .status(StatusCodes.OK)
        .json({ id: newUserId });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAll();

      logger.info("Returned users", { label });

      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          elements: users.map(mapUserRecordToResponsePayload),
        });
    } catch (error) {
      next(error);
    }
  }

  public async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.userId;

      const user = await usersService.findOneById(userId);

      logger.info("Returned user with id " + user._id, { label });

      res
        .status(StatusCodes.OK)
        .json(mapUserRecordToResponsePayload(user));
    } catch (error) {
      next(error);
    }
  }

  public async updateOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.userId;
      const updatePayload = req.body;

      if (!Object.keys(updatePayload).length) {
        throw new BadRequest("Nothing to update, got empty update payload!");
      }

      if (
        updatePayload.role === UserRoles.ADMIN &&
        (req.user as IUser).role !== UserRoles.ADMIN
      ) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({
            message: "Only admin can make another user admin!",
          });
        return;
      }

      const updatedId = await usersService.updateOneById(
        userId,
        updatePayload,
      );

      if (String(updatedId) !== userId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while updating user with id: " + userId +
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
      const userId: string = req.params.userId;

      const removedId = await usersService.removeOneById(
        userId,
      );

      if (String(removedId) !== userId) {
        throw new BaseHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "An error occured while deleting user with id: " + userId +
          " !",
        );
      }

      logger.info("Deleted user with id " + removedId, { label });

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

function mapUserRecordToResponsePayload(user: IUser) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    deliveryAddress: user.deliveryAddress,
    phoneNumber: user.phoneNumber,
    countryCode: user.countryCode,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
