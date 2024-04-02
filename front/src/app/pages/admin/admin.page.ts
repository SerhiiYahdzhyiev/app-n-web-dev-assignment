import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";

import { LoginForm, UserListCopmonent } from "@components";
import { ApiService, AuthService, UserService } from "@services";
import { IUser, UserRoles } from "@interfaces";

import { LoaderPage } from "../loader/loader.page";
import { CookieService } from "ngx-cookie-service";

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
  ],
  providers: [
    ApiService,
    AuthService,
    UserService,
    MatSnackBar,
  ],
})
export class AdminPage implements OnInit {
  private user: IUser = {} as IUser;

  isLoading = true;

  activeTab = "users";

  constructor(
    private userService: UserService,
    private notification: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe(
      (user) => {
        this.user = user as any;
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
