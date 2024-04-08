import { Component, OnInit } from "@angular/core";
import { IOrder } from "@interfaces";
import { LoaderPage } from "../loader/loader.page";
import { OrderComponent } from "@components";
import { CommonModule } from "@angular/common";
import { ApiService, OrderService } from "@services";

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
    ApiService,
    OrderService,
  ]
})
export class OrdersPage implements OnInit {
  orders: IOrder[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.api.isLoading.subscribe(
      (isLoading) => this.isLoading = isLoading,
    );
    this.ordersService.getMine().subscribe(
      (data) => {
        this.orders = (data as any).elements;
      },
    )
  }

  constructor(
    private api: ApiService,
    private ordersService: OrderService,
  ) { }
}
