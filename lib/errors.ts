import { UseFormReturn } from "react-hook-form"

export function populateFormErrorResponse(
  form: UseFormReturn<any, any, undefined>, 
  errors: Record<string, string[]> | string | undefined
) {
  
  if (errors === undefined) {
    return
  }

  if (typeof errors === 'string') {
    form.setError(
      "root",
      {
        message: errors
      }
    )

    return
  }

  Object.keys(errors).forEach((k) => {
    const errkey = k as keyof typeof form.formState

    if (errkey in errors) {
      form.setError(
        errkey,
        {
          message: errors[errkey.toString()][0]
        }
      )
    } else {
      form.setError(
        "root",
        {
          message: errors[errkey.toString()][0]
        }
      )
    }
  })
}