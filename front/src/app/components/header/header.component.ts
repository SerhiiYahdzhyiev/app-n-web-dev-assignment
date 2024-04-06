import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { IUser } from "@interfaces";
import { ApiService, AuthService } from "@services";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIcon,
  ],
  providers: [
    ApiService,
    AuthService,
  ]
})
export class HeaderComponent {
  @Input() user: IUser | null = null;

  isLoading = false;

  constructor(
    private authService: AuthService
  ) { }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe(() => {
      this.isLoading = false;
      window.location.reload();
    });
  }

}
