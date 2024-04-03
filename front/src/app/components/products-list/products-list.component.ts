import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";

import { IProduct } from "@interfaces";
import { ProductService } from "@services";

//@ts-ignore
const _newProduct: IProduct = {
  title: "New Product",
  description: "New description",
  price: 1,
  imageUrls: [],
};

@Component({
  selector: "products-list",
  standalone: true,
  host: {
    "[style.height]": "'calc(100vh - 60px)'",
    "[style.display]": "'block'",
  },
  templateUrl: "./products-list.component.html",
  styleUrl: "./products-list.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
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

  newImageUrl = "";

  constructor(
    private productService: ProductService,
    private notification: MatSnackBar,
  ) {}

  ngOnInit() {
  }

  removeImageUrl(url: string) {
    let target;
    if (this.isCreatingStarted) {
      target = this.newProduct;
    } else {
      target = this.activeProduct;
    }

    target.imageUrls = target.imageUrls!.filter((u) => u !== url);
  }

  addNewImageUrl() {
    if (this.newImageUrl) {
      let target;
      if (this.isCreatingStarted) {
        target = this.newProduct;
      } else {
        target = this.activeProduct;
      }

      target.imageUrls!.push(this.newImageUrl);
      this.newImageUrl = "";
    }
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
        this.notification.open(
          "Successfully created new product!",
          "Close",
        );
        this.isCreating = false;
        this.isCreatingStarted = false;
        this.products.push({
          //@ts-ignore
          _id: (data as unknown as { id: string }).id,
          ...this.newProduct,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.activeProductId = (data as unknown as { id: string }).id;
        this.activeProduct = this.products.find((p) =>
          p._id === this.activeProductId
        )!;
        this.newProduct = Object.assign({}, _newProduct);
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isCreating = false;
      },
    );
  }

  remove() {
    this.productService.removeOne(this.activeProductId)
      .subscribe(
        (data) => {
          this.notification.open(
            "Successfully removed product with id " +
              (data as unknown as any).removedId,
            "Close",
          );
          this.products = this.products.filter((p) =>
            p._id !== this.activeProductId
          );
          this.activeProduct = this.products[0];
          this.activeProductId = this.activeProduct._id;
          this.isUpdating = false;
        },
        (err) => {
          this.notification.open(err.message, "Close");
          this.isUpdating = false;
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
