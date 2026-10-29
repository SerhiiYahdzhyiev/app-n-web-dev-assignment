import { Component, OnInit, signal } from "@angular/core";
import { IOrder, IProduct } from "@interfaces";
import { LoaderPage } from "../loader/loader.page";
import { OrderComponent } from "@components";
import { CommonModule } from "@angular/common";
import { OrderService, ProductService } from "@services";
import { finalize, forkJoin } from "rxjs";

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
    ProductService,
  ]
})
export class OrdersPage implements OnInit {
  orders: IOrder[] = [];
  products: IProduct[] = [];

  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    forkJoin({
      orders: this.ordersService.getMine(),
      products: this.productsService.getAll(),
    }).pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe(({ orders, products }) => {
      this.orders = (orders as any).elements;
      this.products = (products as any).elements;
    });
  }

  constructor(
    private ordersService: OrderService,
    private productsService: ProductService,
  ) { }
}
