// import { format } from "date-fns"
import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input";

export const memberSchema = z.object({
  firstName: z.string().max(255).min(3),
  lastName: z.string().email(),
  birthPlace: z.string(),
  birthDate: z.date(),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, {'message': 'Invalid Phone Number'})
    .or(z.literal("")),
  address: z.string(),
  personalIDNumber: z.string(),
  picture: z.array(
      z.instanceof(File).refine((file) => file.size < 2 * 1024 * 1024, {
        message: 'File must be less than 4mb'
      }).refine((file) => [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ].includes(file.type), {
        message: 'File must be an image'
      })
    )
    .max(1, {message: 'Only 1 file allowd'})
    .nullable()
})

export const formInitialState = {
  firstName: "",
  lastName: "",
  birthPlace: "",
  birthDate: new Date(),
  phoneNumber: "",
  address: "",
  personalIDNumber: "",
  picture: null
}