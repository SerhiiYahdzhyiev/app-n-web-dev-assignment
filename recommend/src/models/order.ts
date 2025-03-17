import { Document, model, Schema, Types } from "mongoose";

export enum OrderPaymentStatus {
  PENDING = "PENDING",
  SUCCESSFULL = "SUCCESS",
  FAILED = "FAILED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROCESS = "IN_PROCESS",
  DELIVERING = "IN_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface IOrder extends Document {
  totalPrice: number;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  userId: Types.ObjectId;
  productsIds: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const ordersSchema = new Schema<IOrder>({
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: [...Object.values(OrderPaymentStatus)],
    required: true,
    default: OrderPaymentStatus.PENDING,
  },
  status: {
    type: String,
    reqired: true,
    enum: [...Object.values(OrderStatus)],
    default: OrderStatus.PENDING,
  },
  userId: Types.ObjectId,
  productsIds: [Types.ObjectId],
}, { timestamps: true });

ordersSchema.pre("save", async function (next): Promise<void> {
  const order = this;

  order.userId = new Types.ObjectId(order.userId);
  order.productsIds = order.productsIds.map((id) => new Types.ObjectId(id));
  next();
});

export default model("Order", ordersSchema);
