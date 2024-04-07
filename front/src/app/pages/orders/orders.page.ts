import { Component, OnInit } from "@angular/core";
import { IOrder } from "@interfaces";
import { LoaderPage } from "../loader/loader.page";
import { OrderComponent } from "@components";
import { CommonModule } from "@angular/common";
import { OrderService } from "@services";

@Component({
  standalone: true,
  selector: "orders-page",
  templateUrl: "./orders.page.html",
  styleUrl: "./orders.page.css",
  imports: [
    CommonModule,
    LoaderPage,
    OrderComponent,
  ],
  providers: [
    OrderService,
  ]
})
export class OrdersPage implements OnInit {
  orders: IOrder[] = [];

  isLoading = false

  ngOnInit(): void {
    this.isLoading = true;
    this.ordersService.getMine().subscribe(
      (data) => {
        this.orders = (data as any).elements;
        this.isLoading = false;
      },
      () => this.isLoading = false
    )
  }

  constructor(
    private ordersService: OrderService,
  ) { }
}
