import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  { path: "landing", loadComponent: () => import("./pages/landing/landing.page").then(m => m.LandingPage) },
  { path: "admin", loadComponent: () => import("./pages/admin/admin.page").then(m => m.AdminPage) },
  { path: "login", loadComponent: () => import("./pages/login/login.page").then(m => m.LoginPage) },
  { path: "products", loadComponent: () => import("./pages/products/products.page").then(m => m.ProductsPage) },
  { path: "orders", loadComponent: () => import("./pages/orders/orders.page").then(m => m.OrdersPage) },
  { path: "recommended", loadComponent: () => import("./pages/recommended/recommended.page").then(m => m.RecommendedPage) },
  { path: "register", loadComponent: () => import("./pages/register/register.page").then(m => m.RegisterPage) },
  { path: "checkout", loadComponent: () => import("./pages/checkout/checkout.page").then(m => m.CheckoutPage) },
  { path: "**", loadComponent: () => import("./pages/not-found/not-found.page").then(m => m.NotFoundPage) },
];
