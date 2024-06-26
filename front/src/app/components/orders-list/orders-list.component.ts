import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";

import {
  IOrder,
  IProduct,
  IUser,
  OrderPaymentStatus,
  OrderStatus,
} from "@interfaces";
import { OrderService } from "@services";

//@ts-ignore
const _newOrder: IOrder = {
  totalPrice: 0,
  paymentStatus: OrderPaymentStatus.PENDING,
  status: OrderStatus.PENDING,
  userId: "",
  productsIds: [],
};

@Component({
  selector: "orders-list",
  standalone: true,
  host: {
    "[style.height]": "'calc(100vh - 60px)'",
    "[style.display]": "'block'",
  },
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [
    OrderService,
    MatSnackBar,
  ],
})
export class OrdersListCopmonent implements OnInit {
  @Input()
  orders: IOrder[] = [];

  @Input()
  users: IUser[] = [];

  @Input()
  products: IProduct[] = [];

  activeOrderId = "";
  activeOrder: IOrder = {} as IOrder;

  newOrder = Object.assign({}, _newOrder);
  newProductId = "";

  isUpdating = false;
  isCreatingStarted = false;
  isCreating = false;

  constructor(
    private orderService: OrderService,
    private notification: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  addProduct() {
    if (this.newProductId) {
      let target;
      if (this.isCreatingStarted) {
        target = this.newOrder;
      } else {
        target = this.activeOrder;
      }

      target.productsIds.push(this.newProductId);
    }
  }

  removeProduct(id: string) {
    let target;
    if (this.isCreatingStarted) {
      target = this.newOrder;
    } else {
      target = this.activeOrder;
    }

    target.productsIds = target.productsIds.filter((i) => i !== id);
  }

  setCreating() {
    this.activeOrderId = "";
    this.activeOrder = {} as IOrder;
    this.isCreatingStarted = true;
  }

  setActiveOrderId(id: string) {
    this.isCreatingStarted = false;
    this.activeOrderId = id;
    this.activeOrder = {
      ...this.orders.find((order) => order._id === id)!,
    };
  }

  productName(id: string) {
    return this.products.find((p) => p._id === id)!.title;
  }

  getTotalPrice(order: IOrder) {
    let result = 0;
    for (const productId of order.productsIds) {
      result += this.products.find((p) => p._id === productId)!.price;
    }
    return result;
  }

  createOrder() {
    this.isCreating = true;

    this.orderService.createOne(this.newOrder).subscribe(
      (data) => {
        console.log(data);
        this.notification.open(
          "Successfully created new order!",
          "Close",
        );
        this.isCreating = false;
        this.isCreatingStarted = false;
        this.orders.push({
          //@ts-ignore
          _id: (data as unknown as { id: string }).id,
          ...this.newOrder,
          totalPrice: this.newOrder.totalPrice ||
            this.getTotalPrice(this.newOrder),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.activeOrderId = (data as unknown as { id: string }).id;
        this.activeOrder = this.orders.find((o) =>
          o._id === this.activeOrderId
        )!;
        this.newOrder = Object.assign({}, _newOrder);
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isCreating = false;
      },
    );
  }

  remove() {
    this.orderService.removeOne(this.activeOrderId)
      .subscribe(
        (data) => {
          this.notification.open(
            "Successfully removed product with id " +
            (data as unknown as any).removedId,
            "Close",
          );
          this.orders = this.orders.filter((o) => o._id !== this.activeOrderId);
          if (this.orders.length) {
            this.activeOrder = this.orders[0];
            this.activeOrderId = this.activeOrder._id;
          } else {
            this.activeOrder = {} as IOrder;
            this.activeOrderId = "";
          }
          this.isUpdating = false;
        },
        (err) => {
          this.notification.open(err.message, "Close");
          this.isUpdating = false;
        },
      );
  }

  update() {
    this.isUpdating = true;

    const updatePayload: Partial<IOrder> = Object.assign({}, this.activeOrder);

    delete updatePayload.__v;
    delete updatePayload._id;
    delete updatePayload.updatedAt;
    delete updatePayload.createdAt;

    this.orderService.updateOne(this.activeOrderId, updatePayload).subscribe(
      (data) => {
        this.notification.open(
          "Successfully updated order with id " +
          (data as unknown as any).updatedId,
          "Close",
        );
        let old = this.orders.find((o) => o._id === this.activeOrderId)!;

        for (const key of Object.keys(updatePayload)) {
          //@ts-ignore
          old[key] = updatePayload[key];
        }
        this.isUpdating = false;
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isUpdating = false;
      },
    );
  }
}
