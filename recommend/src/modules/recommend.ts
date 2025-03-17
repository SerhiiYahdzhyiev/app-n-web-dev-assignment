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

async function getRecommendedProductsBy(similarUserIds: mongoose.Types.ObjectId[]) {
  return await Order.aggregate([
    { $match: { userId: { $in: similarUserIds }, status: OrderStatus.DELIVERED } },
    { $unwind: "$productsIds" },
    { $group: { _id: "$productsIds", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: K }
  ]);
}

async function getOtherUsersOrders(userId: mongoose.Types.ObjectId) {
  return await Order.aggregate([
    {$match: {userId: {$ne:userId},status:OrderStatus.DELIVERED}},
    {$group: {_id: "$userId", products: {$push: "$productsIds"}}},
  ])
}

function getJaccardSimilarity(a: Set<any>, b: Set<any>) {
  const intersection = new Set([...a].filter(i => b.has(i)));
  const union = new Set([...a, ...b]);

  const similarity = intersection.size / union.size;

  //TODO: Add extra validations... ?

  return similarity
}

//TODO: Improve typing or arguments...
function getJaccardSimilarities(otherOrders: any[], userProducts: Set<string>) {
  return otherOrders
      .map(({ _id, products }) => {
        const otherProducts = new Set(products.flat().map(String));
        const similarity = getJaccardSimilarity(otherProducts, userProducts);
        return { userId: _id.toString(), similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, K);
}

export async function getRecommendedProducts(userId: string) {
  const uid = new mongoose.Types.ObjectId(userId);

  const userOrders = await Order.find({userId: uid, status: OrderStatus.DELIVERED});

  if (!userOrders.length) return await getFallbackProducts();

  const userProducts = new Set(
    userOrders.flatMap((order) => order.productsIds.map(String))
  );

  const otherOrders = await getOtherUsersOrders(uid);

  if (!otherOrders.length) return await getFallbackProducts();

  const similarities = getJaccardSimilarities(otherOrders, userProducts);
  const similarUserIds = similarities.map(
    s => new mongoose.Types.ObjectId(s.userId)
  );

  const recommendedIds = await getRecommendedProductsBy(similarUserIds);
  const recommendedProducts = await Product.find({_id: {$in: recommendedIds}});

  return recommendedProducts;
}
