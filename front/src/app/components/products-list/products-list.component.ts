import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";

import { IProduct } from "@interfaces";
import { ProductService } from "@services";

const _newProduct = {
  title: "Nes Product",
  description: "New description",
  price: 1,
  imageUrls: [],
};

@Component({
  selector: "products-list",
  standalone: true,
  templateUrl: "./products-list.component.html",
  styleUrl: "./products-list.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [
    ProductService,
    MatSnackBar,
  ],
})
export class ProductsListCopmonent implements OnInit {
  @Input()
  products: IProduct[] = [];

  activeProductId = "";
  activeProduct: IProduct = {} as IProduct;

  newProduct = Object.assign({}, _newProduct);

  isUpdating = false;
  isCreatingStarted = false;
  isCreating = false;

  constructor(
    private productService: ProductService,
    private notification: MatSnackBar,
  ) {}

  ngOnInit() {
  }

  setCreating() {
    this.activeProductId = "";
    this.activeProduct = {} as IProduct;
    this.isCreatingStarted = true;
  }

  setActiveProductId(id: string) {
    this.isCreatingStarted = false;
    this.activeProductId = id;
    this.activeProduct = {
      ...this.products.find((product) => product._id === id)!,
    };
  }

  createProduct() {
    this.isCreating = true;

    this.productService.createOne(this.newProduct).subscribe(
      (data) => {
        console.log(data);
        this.notification.open(
          "Successfully created new product!",
          "Close",
        );
        this.isCreating = false;
        this.isCreatingStarted = false;
        this.products.push({
          _id: (data as unknown as { id: string }).id,
          ...this.newProduct,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.newProduct = Object.assign({}, _newProduct);
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isCreating = false;
      },
    );
  }

  update() {
    this.isUpdating = true;

    const updatePayload: Partial<IProduct> = Object.assign(
      {},
      this.activeProduct,
    );

    delete updatePayload._id;
    delete updatePayload.__v;
    delete updatePayload.updatedAt;
    delete updatePayload.createdAt;

    this.productService.updateOne(this.activeProductId, updatePayload)
      .subscribe(
        (data) => {
          this.notification.open(
            "Successfully updated product with id " +
              (data as unknown as any).updatedId,
            "Close",
          );
          let old = this.products.find((p) => p._id === this.activeProductId)!;

          for (const key of Object.keys(updatePayload)) {
            //@ts-ignore
            old[key] = updatePayload[key];
          }
          this.isUpdating = false;
        },
        (err) => {
          this.notification.open(err.message, "Close");
          this.isUpdating = false;
        },
      );
  }
}
