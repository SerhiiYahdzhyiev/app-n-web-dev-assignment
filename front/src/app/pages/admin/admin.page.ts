import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";

import {
  LoginForm,
  OrdersListCopmonent,
  ProductsListCopmonent,
  UserListCopmonent,
} from "@components";
import {
  ApiService,
  AuthService,
  OrderService,
  ProductService,
  UserService,
} from "@services";
import { IOrder, IProduct, IUser, UserRoles } from "@interfaces";

import { LoaderPage } from "../loader/loader.page";
import { RouterLink } from "@angular/router";

@Component({
  selector: "admin-page",
  standalone: true,
  templateUrl: "./admin.page.html",
  styleUrl: "./admin.page.css",
  imports: [
    CommonModule,
    LoginForm,
    LoaderPage,
    MatTabsModule,
    MatButtonModule,
    UserListCopmonent,
    ProductsListCopmonent,
    OrdersListCopmonent,
    RouterLink,
  ],
  providers: [
    ApiService,
    AuthService,
    UserService,
    ProductService,
    OrderService,
    MatSnackBar,
  ],
})
export class AdminPage implements OnInit, OnDestroy {
  private user: IUser = {} as IUser;

  users: IUser[] = [];
  products: IProduct[] = [];
  orders: IOrder[] = [];

  isLoading = false;

  activeTab = "users";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private notification: MatSnackBar,
  ) { }

  ngOnDestroy(): void {
    document.querySelector("body")?.classList.remove("admin");
  }

  ngOnInit(): void {
    document.querySelector("body")?.classList.add("admin");
    this.isLoading = true;
    this.userService.getMe().subscribe(
      (user) => {
        this.user = user as any;
        this.isLoading = false;
        this.loadData();
      },
      (err) => {
        console.error(err);
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );
  }

  loadData() {
    this.isLoading = true;
    this.userService.getAll().subscribe(
      (data) => {
        this.users = (data as any).elements;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );

    this.productService.getAll().subscribe(
      (data) => {
        this.products = (data as any).elements;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );

    this.orderService.getAll().subscribe(
      (data) => {
        this.orders = (data as any).elements;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );
  }

  setActiveTab(value: "users" | "products" | "orders") {
    this.activeTab = value;
  }

  logout() {
    this.authService.logout().subscribe(() => window.location.reload());
  }

  get isAuthorized() {
    return !this.isLoading && this.user.role === UserRoles.ADMIN;
  }
}
