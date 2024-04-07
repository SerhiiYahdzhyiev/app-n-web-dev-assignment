import { Routes } from "@angular/router";

import {
  LoginPage,
  AdminPage,
  LandingPage,
  NotFoundPage,
  ProductsPage,
  RegisterPage,
  CheckoutPage
} from "@pages";


export const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  { path: "landing", component: LandingPage },
  { path: "admin", component: AdminPage },
  { path: "login", component: LoginPage },
  { path: "products", component: ProductsPage },
  { path: "register", component: RegisterPage },
  { path: "checkout", component: CheckoutPage },
  { path: "**", component: NotFoundPage },
];
