import { CommonModule } from "@angular/common";
import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

import { HeaderComponent, MobileWallComponent } from "@components";
import { ApiService, UserService } from "@services";
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
export class AppComponent implements OnInit, OnChanges {
  innerWidth: number = 0;
  minViewportWidth = 1000;

  user: IUser | null = null;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }


  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.userService.currentUser.subscribe((user) =>  this.user = user as IUser);
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth
  }

  get isAdmin() {
    return window.location.pathname === "/admin";

  }
}
