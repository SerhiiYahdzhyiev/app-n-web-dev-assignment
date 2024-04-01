import { Injectable } from "@angular/core";

import { IUser } from "@interfaces";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  constructor(private client: ApiService) {}

  getMe() {
    return this.client.get<IUser>("/users/me", { withCredentials: true });
  }
}
