import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class BasketService {
  private _items: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);

  add(item: string) {
    this._items.next([...this._items.getValue(), item]);
  }

  remove(item: string) {
    const index = this._items.getValue().indexOf(item);
    this._items.next([...this._items.getValue().slice(0, index), ...this._items.getValue().slice(index + 1)]);
  }

  reset() {
    this._items.next([]);
  }

  get items() {
    return this._items.asObservable();
  }
}
