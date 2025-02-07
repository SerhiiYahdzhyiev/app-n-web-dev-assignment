import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrls: string[];

  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: { type: [String], required: false },
}, { timestamps: true });

export default model<IProduct>("Product", productSchema);
