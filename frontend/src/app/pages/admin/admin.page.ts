import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { finalize, forkJoin, of, switchMap, tap } from "rxjs";

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
  AuthService,
  OrderService,
  ProductService,
  UserService,
} from "@services";
import { IOrder, IProduct, IUser, UserRoles } from "@interfaces";

import { LoaderPage } from "../loader/loader.page";

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
  ],
  providers: [
    AuthService,
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

  isLoading = signal(false);

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
    this.isLoading.set(true);
    this.userService.getMe().pipe(
      tap((user) => this.user = user),
      switchMap((user) => {
        if (user.role !== UserRoles.ADMIN) {
          return of(null);
        }
        return forkJoin({
          users: this.userService.getAll(),
          products: this.productService.getAll(),
          orders: this.orderService.getAll(),
        });
      }),
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: (data) => {
        if (!data) {
          return;
        }
        this.users = (data.users as any).elements;
        this.products = (data.products as any).elements;
        this.orders = (data.orders as any).elements;
      },
      error: (err) => {
        console.error(err);
        this.notification.open(err.message || "Unknown error!", "Close");
      },
    });
  }

  setActiveTab(value: "users" | "products" | "orders") {
    this.activeTab = value;
  }

  logout() {
    this.authService.logout().subscribe(() => window.location.reload());
  }

  get isAuthorized() {
    return !this.isLoading() && this.user.role === UserRoles.ADMIN;
  }
}
