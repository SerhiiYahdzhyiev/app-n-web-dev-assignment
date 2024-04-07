import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent, MobileWallComponent } from "@components";
import { ApiService } from "./services/api.service";
import { UserService } from "./services/user.service";
import { IUser } from "@interfaces";
import { LoaderPage } from "./pages/loader/loader.page";

@Component({
  selector: "app-root",
  host: {
    "[style.min-height]": "'100vh'",
    "[style.display]": "'block'",
  },
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    CommonModule,
    RouterOutlet,
    MobileWallComponent,
    HeaderComponent,
    LoaderPage,
  ],
  providers: [
    ApiService,
    UserService,
  ]
})
export class AppComponent implements OnInit {
  innerWidth: number = 0;
  minViewportWidth = 1000;

  user: IUser | null = null;
  isLoading = false;

  constructor(
    private userService: UserService,
  ) { }


  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isLoading = true;
    console.log(this.userService.currentUser);
    this.user = this.userService.currentUser;

    this.userService.getMe().subscribe(
      (user) => {
        this.user = user as unknown as IUser;
        this.userService.currentUser = user as unknown as IUser;
        this.isLoading = false;
      },
      () => this.isLoading = false
    )
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth
  }

  get isAdmin() {
    return window.location.pathname === "/admin";

  }
}
