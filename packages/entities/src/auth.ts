import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password minimal length is 8").max(512),
  confirmPassword: z.string().min(8, "Password minimal length is 8").max(512),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password minimal length is 8").max(512),
});
