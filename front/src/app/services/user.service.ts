import { Injectable } from "@angular/core";

import { IUser } from "@interfaces";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  constructor(private client: ApiService) {}

  getMe() {
    return this.client.get<IUser>("/users/me");
  }

  getAll() {
    return this.client.get<{ success: boolean; elements: IUser[] }>("/users");
  }

  updateOne(id: string, payload: Partial<IUser>) {
    return this.client.put<{ updatedId: string }>("/users/" + id, payload);
  }
}
