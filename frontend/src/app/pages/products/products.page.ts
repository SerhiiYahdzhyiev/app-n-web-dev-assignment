import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { IProduct, IUser } from "@interfaces";
import { finalize } from "rxjs";

import { ProductService, UserService } from "@services";
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
    ProductService,
  ],
})
export class ProductsPage implements OnInit {
  products: IProduct[] = [];
  user: IUser | null = null;

  searchName = "";

  isLoading = signal(false);

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (user) => this.user = user,
    );
    this.isLoading.set(true);
    this.productsService.getAll().pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe((products) => {
      this.products = (products as any).elements as IProduct[];
    });
  }

  constructor(
    private productsService: ProductService,
    private userService: UserService,
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
