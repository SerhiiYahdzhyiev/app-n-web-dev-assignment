import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IOrder } from "@interfaces";

@Injectable()
export class OrderService {
  constructor(private client: ApiService) {}

  getAll() {
    return this.client.get<{ success: boolean; elements: IOrder[] }>(
      "/orders",
    );
  }

  createOne(payload: Partial<IOrder>) {
    return this.client.post<{ id: string }>("/orders/create", payload);
  }

  updateOne(id: string, payload: Partial<IOrder>) {
    return this.client.put<{ updatedId: string }>("/orders/" + id, payload);
  }
}
