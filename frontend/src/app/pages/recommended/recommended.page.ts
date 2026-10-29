import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { IProduct, IUser } from "@interfaces";
import { finalize } from "rxjs";

import { ProductService, UserService } from "@services";
import { ProductComponent } from "@components";

import { LoaderPage } from "../loader/loader.page";

@Component({
  selector: "recommended-page",
  standalone: true,
  templateUrl: "./recommended.page.html",
  styleUrl: "./recommended.page.css",
  imports: [
    CommonModule,
    LoaderPage,
    ProductComponent,
  ],
  providers: [
    ProductService,
  ],
})
export class RecommendedPage implements OnInit {
  products: IProduct[] = [];
  user: IUser | null = null;

  isLoading = signal(false);

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (user) => {
        this.user = user
      },
    );

    this.isLoading.set(true);
    this.productsService.getRecommended().pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe((products) => {
      this.products = (products as any).elements as IProduct[];
    });
  }

  constructor(
    private productsService: ProductService,
    private userService: UserService,
  ) { }

  get hasUser() {
    return this.user !== null;
  }

}
