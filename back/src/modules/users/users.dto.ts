import { z } from "zod";

import {
  emailRegex,
  passwordRegex,
  phoneRegex,
} from "../../common/regex/users";

export enum UserRoles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export const UserValidationSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().regex(emailRegex, { message: "Invalid email format" })
    .email({ message: "Invalid email format" }),
  password: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
  }),
  deliveryAddress: z.string().default("Not provided"),
  phoneNumber: z.string().regex(phoneRegex, {
    message: "Invalid phone number format",
  }).default("000-000-00-00"),
  //TODO: Improve country codes validation
  countryCode: z.string().regex(/^\+\d{1,3}$/, {
    message: "Invalid country code format",
  }).default("+1"),
  role: z.enum([UserRoles.ADMIN, UserRoles.CUSTOMER]).default(
    UserRoles.CUSTOMER,
  ),
}).strict();

export const UserUpdatePayloadValidationSchema = UserValidationSchema.partial();

export type TUserUpdatePayload = z.infer<
  typeof UserUpdatePayloadValidationSchema
>;
