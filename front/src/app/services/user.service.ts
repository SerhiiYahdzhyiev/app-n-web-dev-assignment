import { Injectable } from "@angular/core";

import { IUser } from "@interfaces";
import { ApiService } from "./api.service";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UserService {
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  public readonly currentUser = this._currentUser.asObservable();

  constructor(private client: ApiService) {
    this.getMe().subscribe(
      (user) => this._currentUser.next(user as unknown as IUser),
      () => this._currentUser.next(null)
    )
  }

  getMe() {
    return this.client.get<IUser>("/users/me")
  }

  getAll() {
    return this.client.get<{ success: boolean; elements: IUser[] }>("/users");
  }

  createOne(payload: Partial<IUser>) {
    return this.client.post<{ id: string }>("/users/create", payload);
  }

  updateOne(id: string, payload: Partial<IUser>) {
    return this.client.put<{ updatedId: string }>("/users/" + id, payload);
  }

  removeOne(id: string) {
    return this.client.delete<{ removedId: string }>("/users/" + id);
  }
}
