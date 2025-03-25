import mongoose from "mongoose";
import {recommenderConfig} from "../config/recommender";

import Product from "../models/product";
import Order, { OrderStatus } from "../models/order";

const K = recommenderConfig.productsCount;

async function getFallbackProducts() {
  // INFO: While we don't have product ratings system based on customer reviews
  //       we will simply sort fallback products by total number of purchases.
  return await Order.aggregate([
    { $match: { status: OrderStatus.DELIVERED } },
    { $unwind: "$productsIds" },
    { $group: { _id: "$productsIds", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: K }
  ]).then(res => Product.find({ _id: { $in: res.map(p => p._id) } }));
}

export async function getRecommendedProducts(userId: string) {
  const uid = new mongoose.Types.ObjectId(userId);

  const userOrders = await Order.find({userId: uid, status: OrderStatus.DELIVERED});

  if (!userOrders.length) return await getFallbackProducts();

  const topProductIds = await Order.aggregate([
    { $match: { status: OrderStatus.DELIVERED } },
    { $unwind: "$productsIds" },
    { $group: { _id: "$productsIds", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const topProduct = await Product.findOne({ _id: topProductIds[0]._id });

  if (!topProduct) return await getFallbackProducts();

  const payload = {
    text: topProduct?.category +
      " " + topProduct.description +
      " " + topProduct.title,
    k: K,
  };
  
  const res = await fetch("http://embed:3096/search", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (res.status !== 200) return await getFallbackProducts();

  const data = await res.json();
  if (!data || !data.results.length) return await getFallbackProducts();

  const ids = data.results.map((i: {id: string, distance: number}) => i.id);

  const recommendedProducts = await Product.find({_id: {$in: ids}});
  return recommendedProducts;
}
