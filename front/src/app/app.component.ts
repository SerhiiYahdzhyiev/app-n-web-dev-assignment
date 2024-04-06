import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent, MobileWallComponent } from "@components";

@Component({
  selector: "app-root",
  host: {
    "[style.min-height]": "'100vh'",
    "[style.display]": "'block'",
  },
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    CommonModule,
    RouterOutlet,
    MobileWallComponent,
    HeaderComponent,
  ],
})
export class AppComponent implements OnInit {
  innerWidth: number = 0;
  minViewportWidth = 1000;


  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth
  }
}
