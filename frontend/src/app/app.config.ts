import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { Router, provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HttpClientModule } from "@angular/common/http";
import { BasketService } from "./services/basket.service";
import { ApiService } from "./services/api.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(Router),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BasketService),
    importProvidersFrom(ApiService),
  ],
};
