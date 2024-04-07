import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";

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
    BasketService
  ],
})
export class ProductComponent {
  @Input() product: IProduct | null = null;
  @Input() isAuthorized: boolean = false;

  constructor(
    private notification: MatSnackBar,
    private basket: BasketService,
  ) { }

  get price() {
    return "$" + (this.product!.price / 100).toString();
  }

  showAuthorizedNotification() {
    this.notification.open("To purchase an item you have to be registered!", "Close");
  }
  buy() {
    //TODO: Resolve
    this.basket.add(this.product!._id);
    console.log("Buying...")
  }
  addToBasket() {
    this.basket.add(this.product!._id);
  }
}
