import { z } from "zod"

export const userSchema = z.object({
  id: z.number(),
  name: z.string().max(255).min(3),
  email: z.string().email(),
  password: z.string(),
  reTypePassword: z.string()
}).refine((data) => data.password === data.reTypePassword, {
  message: "Password don't match",
  path: ['reTypePassword']
})

export const formInitialState = {
  id: 0,
  name: "",
  email: "",
  password: "",
  reTypePassword: ""
}