import { Routes } from "@angular/router";

import { AdminPage, LandingPage, NotFoundPage } from "@pages";
export const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  { path: "landing", component: LandingPage },
  { path: "admin", component: AdminPage },
  { path: "**", component: NotFoundPage },
];
