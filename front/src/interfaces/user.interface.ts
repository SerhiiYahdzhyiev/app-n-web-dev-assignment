export enum UserRoles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
}
