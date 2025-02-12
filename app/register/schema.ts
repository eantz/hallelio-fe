import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().max(255),
  email: z.string().email(),
  password: z.string(),
  reTypePassword: z.string()
}).refine((data) => data.password === data.reTypePassword, {
  message: "Password don't match",
  path: ['reTypePassword']
})