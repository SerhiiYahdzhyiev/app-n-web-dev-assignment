import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { IUser } from "@interfaces";
import { AuthService, BasketService } from "@services";

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
    Router,
    AuthService,
  ]
})
export class HeaderComponent implements OnInit {
  @Input() user: IUser | null = null;

  cartItemsNumber: number = 0;

  isLoading = false;

  ngOnInit(): void {
      this.basketService.items.subscribe(
        (data) => this.cartItemsNumber = data.length
      );
   }

  constructor(
    private router: Router,
    private authService: AuthService,
    public basketService: BasketService,
  ) { }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe(() => {
      this.isLoading = false;
      window.location.reload();
    });
  }

  toCheckout() {
    this.router.navigate(["checkout"]);
  }
}
