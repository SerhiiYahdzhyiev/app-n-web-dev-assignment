import { Document, Schema, model  } from "mongoose";

import { UserRoles } from "./users.dto";


export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deliveryAddress?: string;
  phoneNumber?: string;
  countryCode?: string; // e.g. +49, +7...
  role: UserRoles;
}

const userSchema: Schema = new Schema<IUser>({
  firstName: {
    type: String,
    requred: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requred: true,
  },
  deliveryAddress: {
    type: String,
    default: "Not provided",
  },
  phoneNumber: {
    type: String,
    default: "000-000-00-00",
  },
  countryCode: {
    type: String,
    default: "+1",
  },
  role: {
    type: String,
    required: true,
    default: UserRoles.CUSTOMER,
  },
});

export default model<IUser>("User", userSchema);
