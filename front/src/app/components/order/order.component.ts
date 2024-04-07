import { Component, Input } from "@angular/core";
import { IOrder } from "@interfaces";

@Component({
  selector: "order",
  standalone: true,
  templateUrl: "./order.component.html",
  styleUrl: "./oreder.component.css",
})
export class OrderComponent {
  @Input() order: IOrder | null = null;
}
