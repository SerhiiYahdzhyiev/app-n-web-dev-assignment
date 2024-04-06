import { Component } from "@angular/core";
import { RegisterForm } from "@components";

@Component({
  selector: "register-page",
  standalone: true,
  templateUrl: "./register.page.html",
  imports: [
    RegisterForm,
  ]
})
export class RegisterPage { }
