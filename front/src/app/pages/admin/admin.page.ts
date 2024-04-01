import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { LoginForm } from "@components";
import { UserService } from "@services";
import { IUser, UserRoles } from "@interfaces";
import { LoaderPage } from "../loader/loader.page";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "admin-page",
  standalone: true,
  templateUrl: "./admin.page.html",
  styleUrl: "./admin.page.css",
  imports: [
    CommonModule,
    LoginForm,
    LoaderPage,
  ],
  providers: [
    ApiService,
    UserService,
    MatSnackBar,
  ],
})
export class AdminPage implements OnInit {
  private user: IUser = {} as IUser;

  isLoading = true;

  constructor(
    private userService: UserService,
    private notification: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getMe().subscribe(
      (user) => {
        console.log(user);
        this.user = user as any;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );
  }

  get isAuthorized() {
    return !this.isLoading && this.user.role === UserRoles.ADMIN;
  }
}
