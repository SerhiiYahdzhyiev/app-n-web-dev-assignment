import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  category: string;
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
  category: {
    type: String,
    required: false,
    default: "Unknown",
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: { type: [String], required: false },
}, { timestamps: true });

export default model<IProduct>("Product", productSchema);
