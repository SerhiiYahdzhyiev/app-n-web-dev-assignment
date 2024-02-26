import { z } from 'zod';


const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//TODO: Improve phone regex
const phoneRegex = /^\d{10,12}$/; // Example: +123-456-789-012

export enum UserRoles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export const UserValidationSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().regex(emailRegex, { message: 'Invalid email format' }).email({ message: 'Invalid email format' }),
  password: z.string().min(8).regex(passwordRegex, { message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number' }),
  deliveryAddress: z.string().default('Not provided'),
  phoneNumber: z.string().regex(phoneRegex, { message: 'Invalid phone number format' }).default('000-000-00-00'),
  //TODO: Improve country codes validation
  countryCode: z.string().regex(/^\+\d{1,3}$/, { message: 'Invalid country code format' }).default('+1'),
  role: z.enum([UserRoles.ADMIN, UserRoles.CUSTOMER]).default(UserRoles.CUSTOMER),
});
