import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IProduct, IUser } from "@interfaces";

import { ApiService, ProductService, UserService } from "@services";
import { ProductComponent } from "@components";

import { LoaderPage } from "../loader/loader.page";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "products-page",
  standalone: true,
  templateUrl: "./products.page.html",
  styleUrl: "./products.page.css",
  imports: [
    CommonModule,
    LoaderPage,
    FormsModule,
    ProductComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    ApiService,
    ProductService,
  ],
})
export class ProductsPage implements OnInit {
  products: IProduct[] = [];
  user: IUser | null = null;

  searchName = "";

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

  get fileredProducts() {
    if (!this.searchName) {
      return this.products;
    } else {
      return this.products.filter(p => p.title.includes(this.searchName));
    }
  }

  get hasUser() {
    return this.user !== null;
  }

}
