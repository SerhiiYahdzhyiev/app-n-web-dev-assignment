import { NextFunction, Request, Response} from "express";

import { usersService } from "./users.service";
import { IUser } from "./users.model";

import { StatusCodes } from "http-status-codes";


export class UsersController {

  public async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAll();

      console.log(this);

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

  public async getOneById (req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.userId;

      const user = await usersService.getOneById(userId);

      res
        .status(StatusCodes.OK)
        .json(mapUserRecordToResponsePayload(user));
    } catch (error) {
      next(error);
    }
  }

  public async create (req: Request, res: Response, next: NextFunction) {
    try {
      const newUserId = await usersService.create(req.body);

      res
        .status(StatusCodes.OK)
        .json({id: newUserId});
    } catch (error) {
      next(error);
    }
  }
};


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
  };
}
