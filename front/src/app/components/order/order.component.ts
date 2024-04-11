import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { IOrder, IProduct, OrderPaymentStatus, OrderStatus } from "@interfaces";
import { OrderService } from "@services";

declare var paypal: any;

@Component({
  selector: "order",
  standalone: true,
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.css",
  imports: [
    CommonModule,
  ],
  providers: [
    OrderService,
  ],
})
export class OrderComponent implements OnInit {
  @Input() order: IOrder | null = null;
  @Input() products: IProduct[] = [];

  //@ts-ignore
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;

  ngOnInit(): void {
    paypal
      .Buttons({
        style: {
          layout: "horizontal"
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                descripiton: `Order ${this.order!._id}`,
                amount: {
                  currency_code: "USD",
                  value: this.order!.totalPrice
                }
              }
            ]
          })
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          this.onSuccessfullPayment();
        },
        onError: (err: any) => {
          this.onFailedPayment();
        }
      })
      .render(this.paypalElement?.nativeElement)
  }

  constructor(
    private ordersService: OrderService
  ) {}


  pay() {
    //TODO: Resolve...
    console.log("Paying...")
  }

  cancel() {
    this.ordersService.updateOne(this.order!._id, {
      productsIds: this.order!.productsIds,
      userId: this.order!.userId,
      status: OrderStatus.CANCELED
    }).subscribe(
      () => this.order!.status = OrderStatus.CANCELED
    );
  }

  onSuccessfullPayment() {
    this.ordersService.updateOne(this.order!._id, {
      productsIds: this.order!.productsIds,
      userId: this.order!.userId,
      paymentStatus: OrderPaymentStatus.SUCCESSFULL
    }).subscribe(
      () => this.order!.paymentStatus = OrderPaymentStatus.SUCCESSFULL
    );
  }
  
  onFailedPayment() {
    this.ordersService.updateOne(this.order!._id, {
      productsIds: this.order!.productsIds,
      userId: this.order!.userId,
      paymentStatus: OrderPaymentStatus.FAILED
    }).subscribe(
      () => this.order!.paymentStatus = OrderPaymentStatus.FAILED
    );
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

  get canPay() {
    return this.order!.paymentStatus !== OrderPaymentStatus.SUCCESSFULL
      && this.order!.status !== OrderStatus.CANCELED
      && this.order!.status !== OrderStatus.DELIVERED
      && this.order!.status !== OrderStatus.DELIVERING
  }

  get canCancel() {
    return this.order!.status !== OrderStatus.CANCELED
      && this.order!.status !== OrderStatus.DELIVERED;
  };

  get displayPaymentStatus() {
    return this.order!.status !== OrderStatus.CANCELED
  }

  get amount() {
    return (this.order!.totalPrice / 100).toString();
  }
}
