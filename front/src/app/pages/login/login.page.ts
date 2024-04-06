import { Component } from "@angular/core";
import { LoginForm } from "@components";

@Component({
  selector: "login-page",
  standalone: true,
  templateUrl: "./login.page.html",
  imports: [
    LoginForm,
  ]
})
export class LoginPage { }
