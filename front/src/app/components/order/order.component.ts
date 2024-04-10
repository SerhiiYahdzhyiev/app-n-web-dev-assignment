import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { IOrder, IProduct, OrderPaymentStatus, OrderStatus } from "@interfaces";

@Component({
  selector: "order",
  standalone: true,
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.css",
  imports: [
    CommonModule,
  ]
})
export class OrderComponent {
  @Input() order: IOrder | null = null;
  @Input() products: IProduct[] = [];

  pay() {
    //TODO: Resolve...
    console.log("Paying...")
  }

  get paymentStatusStyle() {
    switch (this.order!.paymentStatus) {
      case OrderPaymentStatus.SUCCESSFULL:
        return "color:green;";
      case OrderPaymentStatus.FAILED:
        return "color:red;";
      default:
        return "color:orange;";
    }
  }
  
  get orderStatusStyle() {
    switch (this.order!.status) {
      case OrderStatus.DELIVERED:
        return "color:green;";
      case OrderStatus.CANCELED:
        return "color:red;";
      default:
        return "color:darkgray;";
    }
  }

  get formattedDate() {
    return new Date(this.order!.createdAt).toString().slice(0, 21);
  }

  get productTitles() {
    return this.order!.productsIds.map(i => this.products.find(p => p._id === i)!.title);
  }
}
