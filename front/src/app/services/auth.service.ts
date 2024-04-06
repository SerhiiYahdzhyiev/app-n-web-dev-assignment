import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { IUser } from "@interfaces";

@Injectable()
export class AuthService {
  constructor(private client: ApiService) { }

  login(login: string, password: string) {
    return this.client.post(
      "/auth/login",
      { login, password },
    );
  }

  register(payload: Partial<IUser>) {
    return this.client.post("/auth/register", payload);
  }

  logout() {
    return this.client.get(
      "/auth/logout",
    );
  }
}
