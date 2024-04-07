import { Injectable } from "@angular/core";

@Injectable()
export class BasketService {
  items: string[] = [];

  add(item: string) {
    this.items.push(item);
  }

  remove(item: string) {
    this.items.filter(i => i !== item);
  }
}
