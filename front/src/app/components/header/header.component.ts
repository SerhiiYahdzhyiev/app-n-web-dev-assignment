import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { IUser } from "@interfaces";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [
    Router
  ]
})
export class HeaderComponent {
  @Input() user: IUser | null = null;

  constructor(private router: Router) { }

  toLogin() {
    this.router.navigate(["login"]);
  }
  toRegister() {
    this.router.navigate(["register"]);
  }
}
