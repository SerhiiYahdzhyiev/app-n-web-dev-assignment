import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";

import { IUser, UserRoles } from "@interfaces";
import { UserService } from "@services";

const _newUser = {
  firstName: "New",
  lastName: "User",
  email: "",
  password: "",
  countryCode: "+1",
  phoneNumber: "",
  deliveryAddress: "",
  role: UserRoles.CUSTOMER,
};

@Component({
  selector: "users-list",
  standalone: true,
  host: {
    "[style.height]": "'calc(100vh - 60px)'",
    "[style.display]": "'block'",
  },
  templateUrl: "./users-list.component.html",
  styleUrl: "./users-list.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [
    UserService,
    MatSnackBar,
  ],
})
export class UserListCopmonent implements OnInit {
  @Input()
  users: IUser[] = [];

  activeUserId = "";
  activeUser: IUser = {} as IUser;

  newUser = Object.assign({}, _newUser);

  isUpdating = false;
  isCreatingStarted = false;
  isCreating = false;

  constructor(
    private userService: UserService,
    private notification: MatSnackBar,
  ) {}

  ngOnInit() {
  }

  setCreating() {
    this.activeUserId = "";
    this.activeUser = {} as IUser;
    this.isCreatingStarted = true;
  }

  setActiveUserId(id: string) {
    this.isCreatingStarted = false;
    this.activeUserId = id;
    this.activeUser = {
      ...this.users.find((user) => user.id === id)!,
      password: "",
    };
  }

  createUser() {
    this.isCreating = true;

    this.userService.createOne(this.newUser).subscribe(
      (data) => {
        console.log(data);
        this.notification.open(
          "Successfully created new user!",
          "Close",
        );
        this.isCreating = false;
        this.isCreatingStarted = false;
        this.users.push({
          id: (data as unknown as { id: string }).id,
          ...this.newUser,
          password: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        this.newUser = Object.assign({}, _newUser);
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isCreating = false;
      },
    );
  }

  update() {
    this.isUpdating = true;

    const updatePayload: Partial<IUser> = Object.assign({}, this.activeUser);

    delete updatePayload.id;
    delete updatePayload.updatedAt;
    delete updatePayload.createdAt;

    if (!updatePayload.password) {
      delete updatePayload.password;
    }

    this.userService.updateOne(this.activeUserId, updatePayload).subscribe(
      (data) => {
        this.notification.open(
          "Successfully updated user with id " +
            (data as unknown as any).updatedId,
          "Close",
        );
        let old = this.users.find((u) => u.id === this.activeUserId)!;

        for (const key of Object.keys(updatePayload)) {
          //@ts-ignore
          old[key] = updatePayload[key];
        }
        this.isUpdating = false;
      },
      (err) => {
        this.notification.open(err.message, "Close");
        this.isUpdating = false;
      },
    );
  }
}
