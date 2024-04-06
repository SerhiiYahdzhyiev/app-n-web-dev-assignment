import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { MobileWallComponent } from "@components";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  imports: [
    CommonModule,
    RouterOutlet,
    MobileWallComponent,
  ],
})
export class AppComponent implements OnInit {
  innerWidth: number = 0;
  minViewportWidth = 600;


  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth
  }
}
