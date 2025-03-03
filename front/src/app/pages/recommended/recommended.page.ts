import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IProduct, IUser } from "@interfaces";

import { ApiService, ProductService, UserService } from "@services";
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
    ApiService,
    ProductService,
  ],
})
export class RecommendedPage implements OnInit {
  products: IProduct[] = [];
  user: IUser | null = null;

  isLoading = false;

  ngOnInit(): void {
    this.api.isLoading.subscribe(
      (isLoading) => this.isLoading = isLoading,
    );
    this.userService.currentUser.subscribe(
      (user) => this.user = user,
    );
    this.productsService.getAll().subscribe(
      (products) => {
        this.products = (products as any).elements as unknown as IProduct[];
      },
    )
  }

  constructor(
    private productsService: ProductService,
    private userService: UserService,
    private api: ApiService,
  ) { }

  get hasUser() {
    return this.user !== null;
  }

}
