import { Routes } from "@angular/router";

import { LoginPage, AdminPage, LandingPage, NotFoundPage, ProductsPage } from "@pages";


export const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  { path: "landing", component: LandingPage },
  { path: "admin", component: AdminPage },
  { path: "login", component: LoginPage },
  { path: "register", component: LoginPage },
  { path: "products", component: ProductsPage },
  { path: "**", component: NotFoundPage },
];
