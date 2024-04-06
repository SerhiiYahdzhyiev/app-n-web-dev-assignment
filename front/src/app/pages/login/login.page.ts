import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { LoginForm } from "@components";
import { UserService } from "@services";

@Component({
  selector: "login-page",
  standalone: true,
  templateUrl: "./login.page.html",
  imports: [
    LoginForm,
  ],
  providers: [
    UserService
  ]
})
export class LoginPage implements OnInit {
  user: any = null;

  ngOnInit(): void {
    this.userService.getMe().subscribe(
      (me) => this.router.navigate(["landing"])
    )
  }

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }
}
