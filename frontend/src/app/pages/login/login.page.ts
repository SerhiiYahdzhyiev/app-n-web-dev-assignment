import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { LoginForm } from "@components";
import { UserService } from "@services";

@Component({
  selector: "login-page",
  standalone: true,
  templateUrl: "./login.page.html",
  imports: [
    LoginForm,
  ],
  providers: [
    UserService,
    Router,
  ]
})
export class LoginPage { }
