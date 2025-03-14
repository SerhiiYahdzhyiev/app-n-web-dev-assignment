import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IProduct } from "@interfaces";

@Injectable()
export class ProductService {
  constructor(private client: ApiService) {}

  getAll() {
    return this.client.get<{ success: boolean; elements: IProduct[] }>(
      "/products",
    );
  }

  createOne(payload: Partial<IProduct>) {
    return this.client.post<{ id: string }>("/products/create", payload);
  }

  updateOne(id: string, payload: Partial<IProduct>) {
    return this.client.put<{ updatedId: string }>("/products/" + id, payload);
  }

  removeOne(id: string) {
    return this.client.delete<{ removedId: string }>("/products/" + id);
  }
}
