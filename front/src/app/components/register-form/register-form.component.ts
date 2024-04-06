import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { ApiService, AuthService } from "@services";

@Component({
  selector: "register-form",
  standalone: true,
  templateUrl: "./register-form.component.html",
  styleUrl: "./register-form.component.css",
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    MatSnackBar,
    AuthService,
    Router,
  ],
})
export class RegisterForm {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  phoneNumber: string = "";
  countryCode: string = "+1";
  deliveryAddress: string = "";

  error: string = "";

  isLoading = false;

  constructor(
    private authService: AuthService,
    private notification: MatSnackBar,
    private router: Router,
  ) { }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.register();
    }
  }

  register() {
    this.isLoading = true;
    this.authService.register(this.payload).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(["landing"]);
      },
      (err) => {
        this.error = err.message;
        this.notification.open(err?.message || "Unknown error!", "Close");
        this.isLoading = false;
      },
    );
  }

  get payload() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      countryCode: this.countryCode,
      phoneNumber: this.phoneNumber,
      deliveryAddress: this.deliveryAddress,
    }
  }
}
