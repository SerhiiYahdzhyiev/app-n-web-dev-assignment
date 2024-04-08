import { Component, OnInit } from "@angular/core";
import { ProductComponent } from "@components";
import { IProduct, IUser } from "@interfaces";
import { ApiService, BasketService, OrderService, ProductService, UserService } from "@services";
import { LoaderPage } from "../loader/loader.page";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "checkout-page",
  standalone: true,
  templateUrl: "./chekcout.page.html",
  styleUrl: "./checkout.page.css",
  imports: [
    CommonModule,
    ProductComponent,
    LoaderPage,
  ],
  providers: [
    ProductService,
    OrderService,
    UserService,
  ]
})
export class CheckoutPage implements OnInit {
  itemsIds = [] as string[];

  user: IUser | null = null;
  products: IProduct[] = [];

  isLoading = false;
  isCreating = false;

  ngOnInit(): void {
    this.basket.items.subscribe(
      (items) => this.itemsIds = items,
    );
    this.api.isLoading.subscribe(
      (isLoading) => {
        console.log(isLoading);
        this.isLoading = isLoading
      },
    );
    this.productsService.getAll().subscribe(
      (data) => {
        console.log(data);
        this.products = (data as any).elements
      },
    )
    this.userService.currentUser.subscribe(
      (user) => this.user = user,
    );
  }
  
  constructor(
    private router: Router,
    private api: ApiService,
    private basket: BasketService,
    private productsService: ProductService,
    private userService: UserService,
    private ordersService: OrderService,
  ) {}

  createOrder() {
    this.isCreating = true;
    this.ordersService.createOne({
      userId: this.user!.id,
      productsIds: this.itemsIds,
    }).subscribe(
      () => {
        this.isCreating = false
        this.basket.reset();
        this.router.navigate(["orders"]);
      },
      () => this.isCreating = false,
    );
  }

  get items() {
    return this.itemsIds.map(id => this.products.find(p => p._id === id));
  }

  get isAuthorized() {
    return !!this.user;
  }

  get totalPrice() {
    return this.items.reduce((a, i) => a + i!.price, 0);
  }
}
