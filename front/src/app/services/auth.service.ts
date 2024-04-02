import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";

@Injectable()
export class AuthService {
  constructor(private client: ApiService) {}

  login(login: string, password: string) {
    return this.client.post(
      "/auth/login",
      { login, password },
    );
  }

  logout() {
    return this.client.get(
      "/auth/logout",
    );
  }
}
