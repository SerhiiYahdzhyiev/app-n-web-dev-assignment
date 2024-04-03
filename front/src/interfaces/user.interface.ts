export enum UserRoles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  countryCode: string;
  deliveryAddress: string;
  role: UserRoles;

  createdAt: string;
  updatedAt: string;
}
