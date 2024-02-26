import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";

import { HASH_SALT } from "../../config/bcrypt";

import { BadRequest, NotFound } from "../../common/exceptions";

import User, { IUser } from "./users.model";


export interface IUsersService {
  getAll: () => Promise<IUser[]>;
  getOneById: (id: string) => Promise<IUser>;
  create: (payload: IUser) => Promise<ObjectId>;
};

class UsersService implements IUsersService {
  public async getAll() {
    const users = await User.find();

    return users;
  }

  public async getOneById(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequest(`Not valid userId value! Value: ${id}`);
    }

    const user = await User.findById(id);

    if (!user) throw new NotFound(`User with id "${id}" was not found!`);

    return user;
  }

  public async create(payload: IUser) {
    const candidate = await User.findOne({email: payload.email});

    if (candidate) {
      throw new BadRequest(`User with email "${payload.email}" already exists!`);
    }

    const hashedPassword = await bcrypt.hash(payload.password, HASH_SALT);

    const newUser = new User({
      ...payload,
      password: hashedPassword,
    });

    await newUser.save();

    return newUser._id;
  }
};

export const usersService = new UsersService();
