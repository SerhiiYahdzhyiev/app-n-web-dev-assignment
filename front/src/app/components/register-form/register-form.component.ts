import { Component } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { ApiService, AuthService } from "@services";

@Component({
  selector: "login-form",
  standalone: true,
  templateUrl: "./register-form.component.html",
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
  ],
})
export class LoginForm {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  phoneNumber: string = "";
  countryCode: string = "";
  deliveryAddress: string = "";

  error: string = "";

  isLogging = false;

  constructor(
    private authService: AuthService,
    private notification: MatSnackBar,
  ) { }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.login();
    }
  }

  register() {
    this.isLoading = true;
    this.authService.register(this.login_, this.pass).subscribe(
      () => {
        this.isLogging = false;
        window.location.reload();
      },
      (err) => {
        this.error = err.message;
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLogging = false;
      },
    );
  }
}
