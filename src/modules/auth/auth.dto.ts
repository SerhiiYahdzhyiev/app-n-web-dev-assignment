import { z } from "zod";

import { emailRegex } from "../../common/regex/users";

export const LoginDataSchema = z.object({
  login: z.string().regex(emailRegex, { message: "Invalid email format" }),
  password: z.string().nonempty(),
});
