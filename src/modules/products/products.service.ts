import { ObjectId } from "mongoose";

import { NotFound } from "../../common/exceptions";

import { TProductUpdatePayload } from "./products.dto";
import Product, { IProduct } from "./products.model";

export interface IProductService {
  create: (payload: IProduct) => Promise<ObjectId>;
  findAll: () => Promise<IProduct[]>;
  findManyByTitle: (title: string) => Promise<IProduct[]>;
  findOneById: (id: string) => Promise<IProduct>;
  updateOneById: (
    id: string,
    payload: TProductUpdatePayload,
  ) => Promise<ObjectId>;
  removeOneById: (id: string) => Promise<ObjectId>;
}

class ProductService implements IProductService {
  public async create(payload: IProduct) {
    const newProduct = new Product({ ...payload });

    await newProduct.save();

    return newProduct._id;
  }

  public async findAll() {
    return await Product.find();
  }

  public async findManyByTitle(title: string) {
    return await Product.find({ title: { $regex: title, $options: "i" } });
  }

  public async findOneById(id: string) {
    const product = await Product.findOne({ _id: id });
    if (!product) throw new NotFound(`Product with id '${id}' was not found!`);
    return product;
  }

  public async updateOneById(id: string, payload: TProductUpdatePayload) {
    const product = await Product.findOneAndUpdate({ _id: id }, payload);

    if (!product) throw new NotFound(`Product with id '${id}' was not found!`);

    return product._id;
  }

  public async removeOneById(id: string) {
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) throw new NotFound(`Product with id '${id}' was not found!`);
    return product._id;
  }
}

export const productService = new ProductService();
