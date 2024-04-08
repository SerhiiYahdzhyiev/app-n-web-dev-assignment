import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class BasketService {
  private _items: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);

  add(item: string) {
    this._items.next([...this._items.getValue(), item]);
  }

  remove(item: string) {
    this._items.next(this._items.getValue().filter(i => i !== item));
  }

  get items() {
    return this._items.asObservable();
  }
}
