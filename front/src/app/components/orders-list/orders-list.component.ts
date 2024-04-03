import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";

import { IOrder, OrderPaymentStatus, OrderStatus } from "@interfaces";
import { OrderService } from "@services";

const _newOrder = {
  totalPrice: 0,
  paymentStatus: OrderPaymentStatus.PENDING,
  status: OrderStatus.PENDING,
  userId: "",
  productsIds: [],
};

@Component({
  selector: "orders-list",
  standalone: true,
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [
    OrderService,
    MatSnackBar,
  ],
})
export class ordersListCopmonent implements OnInit {
  @Input()
  orders: IOrder[] = [];

  activeOrderId = "";
  activeOrder: IOrder = {} as IOrder;

  newOrder = Object.assign({}, _newOrder);

  isUpdating = false;
  isCreatingStarted = false;
  isCreating = false;

  constructor(
    private orderService: OrderService,
    private notification: MatSnackBar,
  ) {}

  ngOnInit() {
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
          _id: (data as unknown as { id: string }).id,
          ...this.newOrder,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.newOrder = Object.assign({}, _newOrder);
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isCreating = false;
      },
    );
  }

  update() {
    this.isUpdating = true;

    const updatePayload: Partial<IOrder> = Object.assign({}, this.activeOrder);

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
