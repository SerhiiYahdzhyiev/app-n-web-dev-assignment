import { Routes } from "@angular/router";

import { LandingPage, NotFoundPage } from "@pages";

export const routes: Routes = [
  { path: "", component: LandingPage },
  { path: "**", component: NotFoundPage },
];
