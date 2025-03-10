// import { format } from "date-fns"
import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input";

export type Member = {
  id: string,
  first_name: string,
  last_name: string,
  birth_place: string,
  birth_date: string,
  phone_number: string,
  address: string,
  personal_id_number: string,
  picture: string
}

export const memberSchema = z.object({
  id: z.string(),
  first_name: z.string().max(255).min(3),
  last_name: z.string().max(255),
  birth_place: z.string(),
  birth_date: z.date().nullable(),
  phone_number: z
    .string()
    .refine(isValidPhoneNumber, {'message': 'Invalid Phone Number'})
    .or(z.literal("")),
  address: z.string(),
  personal_id_number: z.string(),
  picture: z.string()
})

export const formInitialState = {
  id: "",
  first_name: "",
  last_name: "",
  birth_place: "",
  birth_date: null,
  phone_number: "",
  address: "",
  personal_id_number: "",
  picture: ""
}