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
export interface IOrder {
  _id: string;
  totalPrice: number;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  userId: string;
  productsIds: string[];

  createdAt: string;
  updatedAt: string;
}
