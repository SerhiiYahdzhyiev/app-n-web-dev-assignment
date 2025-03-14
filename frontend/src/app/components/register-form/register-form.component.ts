import { Component, EventEmitter, Output } from "@angular/core";

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
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    ApiService,
    MatSnackBar,
    AuthService,
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
  ) { }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.register();
    }
  }

  register() {
    if (!this.canSend) {
      this.notification.open("All fields are required!", "Closed");
      return;
    }
    this.isLoading = true;
    this.authService.register(this.payload).subscribe(
      () => {
        this.isLoading = false;
        window.location.pathname = "/login";
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

  get canSend() {
    return this.firstName &&
      this.lastName &&
      this.email &&
      this.password &&
      this.countryCode &&
      this.phoneNumber &&
      this.deliveryAddress;
  }
}
