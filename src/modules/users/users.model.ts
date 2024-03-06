import bcrypt from "bcrypt";
import { Document, model, Schema } from "mongoose";

import { UserRoles } from "./users.dto";
import { HASH_SALT } from "../../config/bcrypt";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deliveryAddress?: string;
  phoneNumber?: string;
  countryCode?: string; // e.g. +49, +7...
  role: UserRoles;

  isValidPassword: (password: string) => Promise<boolean>;
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
    enum: [...Object.values(UserRoles)],
    required: true,
    default: UserRoles.CUSTOMER,
  },
});

userSchema.pre("save", async function(next): Promise<void> {
  const user = this;
  const hash = await bcrypt.hash(user.password as string, HASH_SALT);

  user.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function(
  password: string,
): Promise<boolean> {
  return Boolean(await bcrypt.compare(password, this.password));
};

export default model<IUser>("User", userSchema);
