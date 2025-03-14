import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { IProduct } from "@interfaces";
import { BasketService } from "@services";

@Component({
  selector: "product",
  standalone: true,
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.css",
  imports: [
    CommonModule,
  ],
  providers: [
    MatSnackBar,
  ],
})
export class ProductComponent {
  @Input() product: IProduct | null = null;
  @Input() isAuthorized: boolean = false;
  @Input() onCheckout: boolean = false;

  constructor(
    private notification: MatSnackBar,
    private basket: BasketService,
    private router: Router,
  ) { }

  get price() {
    return "$" + (this.product!.price / 100).toString();
  }

  showAuthorizedNotification() {
    this.notification.open("To purchase an item you have to be registered!", "Close");
  }

  buy() {
    this.basket.add(this.product!._id);
    this.router.navigate(["checkout"]);
  }

  addToBasket() {
    this.basket.add(this.product!._id);
    this.notification.open(`Add one ${this.product!.title} to basket!`, "Close");
  }

  removeFromBasket() {
    this.basket.remove(this.product!._id);
  }
}
