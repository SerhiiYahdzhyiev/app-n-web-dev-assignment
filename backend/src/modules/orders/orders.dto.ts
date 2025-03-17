import { z } from "zod";
import { isValidObjectId } from "mongoose";

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

const objectIdValidationCallback = (value: string): value is string =>
  isValidObjectId(value);

export const orderCreationSchema = z.object({
  paymentStatus: z.nativeEnum(OrderPaymentStatus)
    .default(
      OrderPaymentStatus.PENDING,
    ).optional(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING).optional(),
  userId: z.string().nonempty().refine<string>(objectIdValidationCallback, {
    message: "Not valid userId format!",
  }),
  productsIds: z.string().refine<string>(
    objectIdValidationCallback,
    {
      message: "Not valid productId format!",
    },
  ).array().nonempty({
    message: "Cannot create/update order with no products!",
  }),
  totalPrice: z.number().nonnegative().optional(),
}).strict();

export const orderUpdationSchema = z.object({
  paymentStatus: z.nativeEnum(OrderPaymentStatus)
    .default(
      OrderPaymentStatus.PENDING,
    ).optional(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING).optional(),
  userId: z.string().nonempty().refine<string>(objectIdValidationCallback, {
    message: "Not valid userId format or empty userId!",
  }),
  productsIds: z.string().refine<string>(
    objectIdValidationCallback,
    {
      message: "Not valid productId format!",
    },
  ).array().nonempty({
    message: "Cannot create/update order with no products!",
  }),
  totalPrice: z.number().min(1).nonnegative().optional(),
}).strict();

export type TOrderCreationPayload = z.infer<typeof orderCreationSchema>;
export type TOrderUpdatePayload = z.infer<typeof orderUpdationSchema>;
