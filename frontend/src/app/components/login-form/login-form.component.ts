import { Component, signal } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { AuthService, UserService } from "@services";

@Component({
  selector: "login-form",
  standalone: true,
  templateUrl: "./login-form.component.html",
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  providers: [
    MatSnackBar,
    AuthService,
  ],
})
export class LoginForm {
  login_: string = "";
  pass: string = "";

  error: string = "";

  isLogging = signal(false);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notification: MatSnackBar,
  ) { }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.login();
    }
  }

  login() {
    this.isLogging.set(true);
    this.authService.login(this.login_, this.pass).subscribe(
      () => {
        this.userService.refreshCurrentUser().subscribe(() => {
          this.isLogging.set(false);
          if (window.location.pathname === "/login") {
            window.location.pathname = "/landing";
          } else {
            window.location.reload();
          }
        });
      },
      (err) => {
        this.error = err.message;
        this.notification.open(err.message || "Unknown error!", "Close");
        this.isLogging.set(false);
      },
    );
  }
}
