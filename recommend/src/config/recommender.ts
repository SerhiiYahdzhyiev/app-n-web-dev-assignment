import {config} from "dotenv";

config();

class RecommenderConfig {
  public productsCount: number = +process.env.REC_COUNT! || 3;
}

const recommenderConfig = new RecommenderConfig();

export {recommenderConfig};
