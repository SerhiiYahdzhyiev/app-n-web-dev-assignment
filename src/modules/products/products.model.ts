import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
}

const productSchema: Schema = new Schema<IProduct>({
  title: {
    type: String,
    requred: true,
  },
  description: {
    type: String,
    requred: true,
  },
  price: {
    type: Number,
    requred: true,
  },
  imageUrls: { type: [String], required: false },
});

export default model<IProduct>("Product", productSchema);
