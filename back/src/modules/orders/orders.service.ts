import { ObjectId } from "mongoose";

import { NotFound } from "../../common/exceptions";

import Order, { IOrder } from "./orders.model";
import { TOrderCreationPayload, TOrderUpdatePayload } from "./orders.dto";

export interface IOrdersService {
  create: (
    payload: TOrderCreationPayload & { totalPrice: number },
  ) => Promise<ObjectId>;

  getAll: () => Promise<IOrder[]>;

  findOneById: (id: string) => Promise<IOrder>;

  updateOneById: (
    id: string,
    payload: TOrderUpdatePayload,
  ) => Promise<ObjectId>;
  removeOneById: (id: string) => Promise<ObjectId>;
}

class OrdersService implements IOrdersService {
  public async create(payload: TOrderCreationPayload & { totalPrice: number }) {
    const newOrder = new Order({ ...payload });

    await newOrder.save();

    return newOrder._id;
  }
  public async getAll() {
    const orders = await Order.find();

    return orders;
  }

  public async findOneById(id: string) {
    const order = await Order.findById(id);

    if (!order) throw new NotFound(`Order with id "${id}" was not found!`);

    return order;
  }

  public async findManyByUserId(id: string) {
    const orders = await Order.find({ userId: id });

    return orders;
  }

  public async updateOneById(id: string, payload: TOrderUpdatePayload) {
    const order = await Order.findOneAndUpdate({ _id: id }, payload);

    if (!order) throw new NotFound(`Order with id "${id}" was not found!`);

    return order._id;
  }

  public async removeOneById(id: string) {
    const order = await Order.findOneAndDelete({ _id: id });

    if (!order) throw new NotFound(`Order with id "${id}" was not found!`);

    return order._id;
  }
}

export const ordersService = new OrdersService();
