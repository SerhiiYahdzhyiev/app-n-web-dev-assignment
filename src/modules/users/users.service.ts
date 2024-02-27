import { ObjectId } from "mongoose";

import { BadRequest, NotFound } from "../../common/exceptions";

import { TUserUpdatePayload } from "./users.dto";
import User, { IUser } from "./users.model";

export interface IUsersService {
  create: (payload: IUser) => Promise<ObjectId>;

  getAll: () => Promise<IUser[]>;
  getOneById: (id: string) => Promise<IUser>;

  updateOneById: (id: string, pyload: TUserUpdatePayload) => Promise<ObjectId>;

  removeOneById: (id: string) => Promise<ObjectId>;
}

class UsersService implements IUsersService {
  public async create(payload: IUser) {
    const candidate = await User.findOne({ email: payload.email });

    if (candidate) {
      throw new BadRequest(
        `User with email "${payload.email}" already exists!`,
      );
    }

    const newUser = new User(payload);

    await newUser.save();

    return newUser._id;
  }

  public async getAll() {
    const users = await User.find();

    return users;
  }

  public async getOneById(id: string) {
    const user = await User.findById(id);

    if (!user) throw new NotFound(`User with id "${id}" was not found!`);

    return user;
  }

  public async updateOneById(id: string, payload: TUserUpdatePayload) {
    let user = await User.findOneAndUpdate({ _id: id }, payload);

    return user?._id;
  }

  public async removeOneById(id: string) {
    let user = await User.findOneAndDelete({ _id: id });

    return user?._id;
  }
}

export const usersService = new UsersService();
