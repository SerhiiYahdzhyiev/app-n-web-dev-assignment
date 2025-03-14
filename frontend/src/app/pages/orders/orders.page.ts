import { Component, OnInit } from "@angular/core";
import { IOrder, IProduct } from "@interfaces";
import { LoaderPage } from "../loader/loader.page";
import { OrderComponent } from "@components";
import { CommonModule } from "@angular/common";
import { ApiService, OrderService, ProductService } from "@services";

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
    ProductService,
  ]
})
export class OrdersPage implements OnInit {
  orders: IOrder[] = [];
  products: IProduct[] = [];

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
    this.productsService.getAll().subscribe(
      (data) => {
        this.products = (data as any).elements;
      },
    )
  }

  constructor(
    private api: ApiService,
    private ordersService: OrderService,
    private productsService: ProductService,
  ) { }
}
