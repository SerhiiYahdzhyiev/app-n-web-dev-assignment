import mongoose from "mongoose";
import {recommenderConfig} from "../config/recommender";

import Product from "../models/product";
import Order, { OrderStatus } from "../models/order";

const K = recommenderConfig.productsCount;

async function getFallbackProducts() {
    const products = Product.find().limit(recommenderConfig.productsCount);
    return products;
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

  const userOrders = await Order.find({userId: uid, staus: OrderStatus.DELIVERED});

  if (!userOrders.length) return await getFallbackProducts();

  const userProducts = new Set(
    userOrders.flatMap((order) => order.productsIds.map(String))
  );

  const otherOrders = await getOtherUsersOrders(uid);

  if (!otherOrders.length) return await getFallbackProducts();

  const similarities = getJaccardSimilarities(otherOrders, userProducts);

  const recommendedProductCounts: Record<string, number> = {};
  for (const { userId } of similarities) {
    const orders = await Order.find({ userId, status: "DELIVERED" });
    for (const order of orders) {
      for (const productId of order.productsIds) {
        const idStr = productId.toString();
        if (!userProducts.has(idStr)) {
          recommendedProductCounts[idStr] =
            (recommendedProductCounts[idStr] || 0) + 1;
        }
      }
    }
  }

  const topRecommendedIds = Object.entries(recommendedProductCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, K)
      .map(([productId]) => new mongoose.Types.ObjectId(productId));

  const recommendedProducts = await Product.find({
    _id: { $in: topRecommendedIds },
  });

  return recommendedProducts;
}
